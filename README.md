# Directis360 ↔ Wajibet Integration

This repository contains the integration bridge between **Directis360** (School Management Platform) and **Wajibet** (Interactive Gaming Service).

## 🏗️ Architecture
The integration follows a "Federated Auth + Rebuilt UI" approach:
- **Directis360 (Frontend)**: Rebuilds Wajibet UI components for a seamless user experience.
- **psAPI (Directis Backend)**: Acts as the Identity Provider, issuing short-lived exchange tokens.
- **Wajibet (Backend)**: Acts as the Service Provider, auto-provisioning linked accounts and serving game data.

## 🔗 How the Linking Works
1. **SSO Flow**: When a teacher enters the "Games" section, Directis360 requests an **Exchange Token** from `psAPI`.
2. **Auto-Provisioning**: This token is sent to Wajibet's `POST /api/auth/federated`. Wajibet verifies the signature, and if the user doesn't exist, it **auto-creates** a linked account and school.
3. **Session Handoff**: Wajibet responds with a `wajibetJWT`, which the frontend uses for all subsequent game-related API calls.

## 🛠️ Components Modified

### 1. Wajibet Backend (`MadrassaPlay`)
- **Models**: Updated `User` and `School` with `externalId` and `externalSource` fields for cross-system mapping.
- **Auth**: Implemented `federatedAuthRoutes.js` for secure JWT-based invitation/linking.
- **Validation**: Fixed `experience` requirement for auto-provisioned teachers.
- **Robustness**: Added fallback lookup by school name to prevent duplicate key errors during auto-linking.

### 2. Directis360 Backend (`psAPI`)
- **Routes**: Added `wajibet.routes.js` to handle token generation.
- **Security**: Implemented JWT signing using a shared `FEDERATED_SECRET`.

### 3. Directis360 Frontend
- **Service**: `wajibetService.ts` provides a clean API for session initialization and game CRUD operations.
- **UI**: Added a "Games" tab to the Teacher Dashboard (`teacher-games.tsx`) using Lucide icons and Shadcn UI components.

## 🚀 Setup & Testing
1. **Secrets**: Ensure `FEDERATED_SECRET` is identical in `psAPI` and `Wajibet` `.env` files.
2. **URL**: Set `NEXT_PUBLIC_WAJIBET_API_URL` in the frontend `.env`.
3. **Action**: Login as a teacher, click **Games**, and watch the auto-linking happen!

---
*Note: This documentation was generated following the completion of Phase 1 (Backend Foundation) and Phase 2 (Frontend Integration).*
