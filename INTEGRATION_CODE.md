# Integration Code Reference

All code samples for the Directis360 ↔ Wajibet integration.

---

## Wajibet Team Code

### W1: User Model - Add External Fields
**File**: `MadrassaPlay/server/models/User.js`

```javascript
// Add after line 146 (before timestamps)

// =============== External Integration ===============
externalId: {
  type: String,
  sparse: true,
  index: true,
},
externalSource: {
  type: String,
  enum: ['directis360', 'standalone', null],
  default: null,
},
externalSchoolId: {
  type: String,
  sparse: true,
},
externalMeta: {
  type: mongoose.Schema.Types.Mixed,
},
```

```javascript
// Add index after schema definition

userSchema.index(
  { externalId: 1, externalSource: 1 },
  { unique: true, partialFilterExpression: { externalSource: { $ne: null } } }
);
```

---

### W2: School Model - Add External Fields
**File**: `MadrassaPlay/server/models/School.js`

```javascript
// Add to schema

externalId: { 
  type: String, 
  sparse: true, 
  index: true 
},
externalSource: { 
  type: String, 
  enum: ['directis360', 'standalone', null], 
  default: null 
},
```

---

### W3: Federated Auth Routes
**File**: `MadrassaPlay/server/routes/federatedAuthRoutes.js` [NEW]

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const School = require('../models/School');

const router = express.Router();

const ROLE_MAP = {
  'TEACHER': 'teacher',
  'STUDENT': 'student',
  'HEADMASTER': 'manager',
  'STAFF': 'staff',
  'PARENT': 'student',
};

router.post('/federated', async (req, res) => {
  const { exchangeToken } = req.body;

  if (!exchangeToken) {
    return res.status(400).json({ message: 'Exchange token required' });
  }

  try {
    const decoded = jwt.verify(exchangeToken, process.env.FEDERATED_SECRET);

    if (decoded.purpose !== 'directis_wajibet_exchange') {
      return res.status(400).json({ message: 'Invalid token purpose' });
    }

    const wajibetRole = ROLE_MAP[decoded.role] || 'student';

    // Find or create school
    let school = await School.findOne({
      externalId: decoded.directisSchoolId,
      externalSource: 'directis360'
    });

    if (!school) {
      school = await School.create({
        name: `School-${decoded.directisSchoolId.slice(-6)}`,
        externalId: decoded.directisSchoolId,
        externalSource: 'directis360',
      });
    }

    // Find or create user
    let user = await User.findOne({
      externalId: decoded.directisUserId,
      externalSource: 'directis360'
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const nameParts = (decoded.full_name || 'Directis User').trim().split(' ');
      const email = decoded.email || `directis_${decoded.directisUserId.slice(-8)}@federated.local`;

      user = await User.create({
        firstName: nameParts[0] || 'Directis',
        lastName: nameParts.slice(1).join(' ') || 'User',
        email,
        password: crypto.randomBytes(32).toString('hex'),
        role: wajibetRole,
        school: school._id,
        externalId: decoded.directisUserId,
        externalSource: 'directis360',
        externalSchoolId: decoded.directisSchoolId,
        externalMeta: {
          phone_number: decoded.phone_number,
          national_ID: decoded.national_ID,
          importedAt: new Date(),
        }
      });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        school: school._id,
      },
      isNewUser,
    });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Exchange token expired', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid exchange token', code: 'TOKEN_INVALID' });
    }
    console.error('Federated auth error:', err);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

module.exports = router;
```

---

### W4: Register Routes
**File**: `MadrassaPlay/server/server.js`

```javascript
// Add import
const federatedAuthRoutes = require('./routes/federatedAuthRoutes');

// Add route
app.use('/api/auth', federatedAuthRoutes);
```

---

### W5: CORS Config
**File**: `MadrassaPlay/server/server.js`

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.DIRECTIS_ORIGIN,
  ],
  credentials: true,
}));
```

---

### W6: Environment Variables
**File**: `MadrassaPlay/server/.env`

```bash
FEDERATED_SECRET=your-32-char-hex-secret
DIRECTIS_ORIGIN=http://localhost:3000
```

---

## Directis360 Team Code

### D1: Exchange Token Route
**File**: `psAPI/routes/wajibet.routes.js` [NEW]

```javascript
import { Router } from "express";
import jwt from "jsonwebtoken";
import authenticate from "../middlewares/auth.middleware.js";

const wajibetRouter = Router();

const FEDERATED_SECRET = process.env.FEDERATED_SECRET;
const WAJIBET_API_URL = process.env.WAJIBET_API_URL || "http://localhost:5000";

wajibetRouter.get("/token", authenticate, async (req, res) => {
  try {
    const payload = {
      purpose: "directis_wajibet_exchange",
      version: 1,
      directisUserId: req.school._id?.toString() || req.school.schoolId,
      directisSchoolId: req.school.schoolId,
      role: req.role,
      full_name: req.full_name || null,
      phone_number: req.phone_number || null,
      email: req.email || null,
      national_ID: req.national_ID || null,
    };

    const exchangeToken = jwt.sign(payload, FEDERATED_SECRET, { 
      expiresIn: "60s" 
    });

    res.json({
      exchangeToken,
      expiresIn: 60,
      wajibetApiUrl: WAJIBET_API_URL,
    });
  } catch (err) {
    console.error("Exchange token error:", err);
    res.status(500).json({ error: "Failed to generate exchange token" });
  }
});

export default wajibetRouter;
```

---

### D2: Register Route
**File**: `psAPI/app.js`

```javascript
import wajibetRouter from "./routes/wajibet.routes.js";
app.use("/api/wajibet", wajibetRouter);
```

---

### D3: Environment Variables
**File**: `psAPI/.env`

```bash
FEDERATED_SECRET=your-32-char-hex-secret
WAJIBET_API_URL=http://localhost:5000
```

---

### D4: Wajibet Service
**File**: `Directis360-main/services/wajibetService.ts` [NEW]

```typescript
const WAJIBET_API = process.env.NEXT_PUBLIC_WAJIBET_API_URL || 'http://localhost:5000';

interface WajibetSession {
  token: string;
  user: { _id: string; firstName: string; lastName: string; role: string };
  expiresAt: number;
}

let session: WajibetSession | null = null;

export async function initWajibetSession(directisToken: string): Promise<WajibetSession> {
  if (session && session.expiresAt > Date.now()) {
    return session;
  }

  // Get exchange token
  const exchangeRes = await fetch('/api/wajibet/token', {
    headers: { 'Authorization': `Bearer ${directisToken}` },
  });
  if (!exchangeRes.ok) throw new Error('Failed to get exchange token');
  const { exchangeToken, wajibetApiUrl } = await exchangeRes.json();

  // Exchange for Wajibet session
  const wajibetRes = await fetch(`${wajibetApiUrl || WAJIBET_API}/api/auth/federated`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exchangeToken }),
  });
  if (!wajibetRes.ok) {
    const error = await wajibetRes.json();
    throw new Error(error.message || 'Failed to authenticate with Wajibet');
  }
  const { token, user } = await wajibetRes.json();

  session = {
    token,
    user,
    expiresAt: Date.now() + (2.5 * 24 * 60 * 60 * 1000),
  };
  return session;
}

export function getWajibetToken(): string {
  if (!session || session.expiresAt <= Date.now()) {
    throw new Error('Wajibet session not initialized');
  }
  return session.token;
}

export async function wajibetFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${WAJIBET_API}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${getWajibetToken()}`,
      'Content-Type': 'application/json',
    },
  });
}

export function clearWajibetSession(): void {
  session = null;
}
```

---

### D5: Frontend Environment Variables
**File**: `Directis360-main/.env`

```bash
NEXT_PUBLIC_WAJIBET_API_URL=http://localhost:5000
```

---

### D6: Games List Page
**File**: `Directis360-main/app/dashboard/teacher/games/page.tsx` [NEW]

```typescript
'use client';
import { useEffect, useState } from 'react';
import { initWajibetSession, wajibetFetch } from '@/services/wajibetService';
import { useAuth } from '@/context/AuthContext';

export default function TeacherGamesPage() {
  const { accessToken } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGames() {
      try {
        await initWajibetSession(accessToken);
        const res = await wajibetFetch('/api/games/teacher');
        const data = await res.json();
        setGames(data.games || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (accessToken) loadGames();
  }, [accessToken]);

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Games</h1>
      {games.length === 0 ? (
        <p>No games yet. Create your first game!</p>
      ) : (
        <ul>{games.map((g: any) => <li key={g._id}>{g.title}</li>)}</ul>
      )}
    </div>
  );
}
```

---

## Shared

### S1: Generate Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### S2: Exchange Token Payload

```json
{
  "purpose": "directis_wajibet_exchange",
  "version": 1,
  "directisUserId": "string",
  "directisSchoolId": "string",
  "role": "TEACHER|STUDENT|HEADMASTER|STAFF|PARENT",
  "full_name": "string|null",
  "phone_number": "string|null",
  "email": "string|null",
  "national_ID": "string|null"
}
```
