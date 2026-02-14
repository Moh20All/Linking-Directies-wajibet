# Directis360 ↔ Wajibet Integration Plan

## Overview

| Item | Details |
|------|---------|
| **Goal** | Directis360 teachers access Wajibet games with auto account linking |
| **Approach** | Rebuild UI in Directis360, Wajibet = API + Database |
| **Auth** | Auto-Provisioning (automatic account creation) |

---

## Architecture

```mermaid
flowchart TB
    subgraph Directis360
        D_FE[Next.js Frontend]
        D_API[psAPI Backend]
    end
    
    subgraph Wajibet
        W_API[Express Backend]
        W_DB[(MongoDB)]
    end
    
    D_FE -->|1. GET /api/wajibet/token| D_API
    D_API -->|2. Exchange Token 60s| D_FE
    D_FE -->|3. POST /api/auth/federated| W_API
    W_API -->|4. Find/Create User| W_DB
    W_API -->|5. Wajibet JWT 3d| D_FE
    D_FE -->|6. Game API calls| W_API
```

---

## Auth Flow

```mermaid
sequenceDiagram
    participant T as Teacher
    participant D as Directis360
    participant W as Wajibet
    
    T->>D: Click "Games"
    D->>D: GET /api/wajibet/token
    D->>W: POST /api/auth/federated
    W->>W: Verify token + Find/Create user
    W-->>D: Wajibet JWT
    D->>W: GET /api/games (with JWT)
    W-->>D: Games list
    D-->>T: Display games
```

---

## User Experience Flow

### Teacher First Visit (New Account)

```mermaid
flowchart LR
    A[Teacher in Directis360] --> B[Clicks 'Games' in sidebar]
    B --> C[Loading spinner 1-2s]
    C --> D[Account auto-created in Wajibet]
    D --> E[Games page loads]
    E --> F["Empty state: 'Create your first game'"]
```

### Teacher Returns (Existing Account)

```mermaid
flowchart LR
    A[Teacher clicks 'Games'] --> B[Loading 1s]
    B --> C[Existing account found]
    C --> D[Shows teacher's games list]
```

### Student Playing Game

```mermaid
flowchart LR
    A[Teacher shares game code] --> B[Student enters code]
    B --> C[Student auto-provisioned]
    C --> D[Joins game lobby]
    D --> E[Plays game]
```

---

## Authentication Flow (Detailed)

```mermaid
sequenceDiagram
    autonumber
    participant T as Teacher Browser
    participant D_FE as Directis360 Frontend
    participant D_API as psAPI
    participant W_API as Wajibet API
    participant W_DB as Wajibet MongoDB
    
    Note over T,W_DB: Phase 1: Get Exchange Token
    T->>D_FE: Click "Games" tab
    D_FE->>D_FE: Check: has cached wajibetToken?
    
    alt Has valid token
        D_FE->>W_API: Use existing token
    else No token or expired
        D_FE->>D_API: GET /api/wajibet/token
        D_API->>D_API: Sign exchange token (60s TTL)
        D_API-->>D_FE: { exchangeToken }
        
        Note over T,W_DB: Phase 2: Exchange for Session
        D_FE->>W_API: POST /api/auth/federated
        W_API->>W_API: Verify signature
        W_API->>W_DB: Find user by externalId
        
        alt User exists
            W_DB-->>W_API: Existing user
        else User not found
            W_API->>W_DB: Create new user
            W_DB-->>W_API: New user
        end
        
        W_API-->>D_FE: { token, user, isNewUser }
    end
    
    Note over T,W_DB: Phase 3: Access Games
    D_FE->>W_API: GET /api/games/teacher
    W_API-->>D_FE: Games list
    D_FE->>T: Render games
```

### Token Lifecycle

| Token | Created By | TTL | Purpose |
|-------|-----------|-----|---------|
| Directis JWT | psAPI login | 3 days | Auth in Directis360 |
| Exchange Token | psAPI `/wajibet/token` | **60 seconds** | One-time auth handoff |
| Wajibet JWT | Wajibet `/auth/federated` | 3 days | Auth in Wajibet API |

---

## Edge Cases & Error Handling

### Error Scenarios

| Error | Cause | User Sees | Solution |
|-------|-------|-----------|----------|
| `TOKEN_EXPIRED` | Exchange token > 60s | "Session expired" | Auto-retry: get new token |
| `TOKEN_INVALID` | Secret mismatch | "Auth failed" | Check FEDERATED_SECRET |
| `CORS_ERROR` | Origin not whitelisted | Network error | Add origin to Wajibet CORS |
| `WAJIBET_DOWN` | API unreachable | "Game service unavailable" | Retry with backoff |
| `DUPLICATE_EMAIL` | Email exists in Wajibet | Auth fails | Use externalId+email combo |

### Retry Flow

```mermaid
flowchart TD
    A[API Call Fails] --> B{Error Type?}
    B -->|TOKEN_EXPIRED| C[Get new exchange token]
    C --> D[Retry original request]
    B -->|NETWORK_ERROR| E[Wait 1s]
    E --> F{Retry count < 3?}
    F -->|Yes| G[Retry request]
    F -->|No| H[Show error message]
    B -->|OTHER| H
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Teacher deleted from Directis360 | Wajibet account remains (orphaned) |
| Teacher changes name in Directis360 | Sync on next login |
| School deleted from Directis360 | Wajibet school remains |
| Same email in both systems | Match by externalId, not email |
| Teacher already has Wajibet account | Creates separate linked account |

---

## 🔵 Wajibet Team Tasks

| # | Task | File |
|---|------|------|
| W1 | Add `externalId`, `externalSource` to User model | `models/User.js` |
| W2 | Add `externalId`, `externalSource` to School model | `models/School.js` |
| W3 | Create federated auth route | `routes/federatedAuthRoutes.js` [NEW] |
| W4 | Register route in server | `server.js` |
| W5 | Configure CORS for Directis360 origin | `server.js` |
| W6 | Add `FEDERATED_SECRET` to env | `.env` |

---

## 🟢 Directis360 Team Tasks

| # | Task | File |
|---|------|------|
| D1 | Create exchange token route | `psAPI/routes/wajibet.routes.js` [NEW] |
| D2 | Register route in app | `psAPI/app.js` |
| D3 | Add `FEDERATED_SECRET`, `WAJIBET_API_URL` to env | `psAPI/.env` |
| D4 | Create wajibet service | `services/wajibetService.ts` [NEW] |
| D5 | Add `NEXT_PUBLIC_WAJIBET_API_URL` to env | `.env` |
| D6 | Create Games list page | `app/dashboard/teacher/games/page.tsx` [NEW] |
| D7 | Create Game page | `app/dashboard/teacher/games/create/page.tsx` [NEW] |
| D8 | Edit Game page | `app/dashboard/teacher/games/[id]/edit/page.tsx` [NEW] |
| D9 | Host Game page | `app/dashboard/teacher/games/[id]/host/page.tsx` [NEW] |
| D10 | Add "Games" to teacher sidebar | Layout component |

---

## 🤝 Shared Tasks

| # | Task |
|---|------|
| S1 | Generate `FEDERATED_SECRET` and share securely |
| S2 | Agree on exchange token payload structure |
| S3 | Joint integration testing |

---

## Timeline

```mermaid
gantt
    title Integration Timeline
    dateFormat  YYYY-MM-DD
    section Wajibet
    Schema changes (W1-W2)     :w1, 2026-02-08, 1d
    Auth routes (W3-W6)        :w2, after w1, 1d
    Testing                    :w3, after w2, 1d
    section Directis360
    Backend routes (D1-D3)     :d1, 2026-02-08, 2d
    Frontend service (D4-D5)   :d2, after d1, 1d
    UI Pages (D6-D10)          :d3, after d2, 5d
    section Shared
    Integration test (S3)      :s1, after d3, 2d
```

---

## Environment Variables

| System | Variable | Value |
|--------|----------|-------|
| psAPI | `FEDERATED_SECRET` | Shared secret |
| psAPI | `WAJIBET_API_URL` | `http://localhost:5000` |
| Wajibet | `FEDERATED_SECRET` | Same shared secret |
| Wajibet | `DIRECTIS_ORIGIN` | `http://localhost:3000` |
| Directis360 Frontend | `NEXT_PUBLIC_WAJIBET_API_URL` | `http://localhost:5000` |
