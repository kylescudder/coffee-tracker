# Coffee Tracker

Track espresso extraction time and amounts with a Convex backend, plus web and mobile clients.

## Stack

- **Convex backend** for storage and auth-aware queries.
- **Web** client built with Vite + React.
- **Mobile** client built with Expo + React Native.

## Prerequisites

- Node.js 18+
- A Convex account and project
- An auth provider configured in Convex (Clerk, Auth0, or custom JWT)

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Convex project**

   ```bash
   npx convex dev
   ```

   Follow the prompts to link the repo to a new or existing Convex project.

3. **Configure authentication**

   In the Convex dashboard, set up your auth provider and make sure the issuer
   and client IDs match your provider settings. The clients will use the auth
   provider UI you configure to issue JWTs for Convex.

4. **Set environment variables**

   - `apps/web/.env.local`

     ```bash
     VITE_CONVEX_URL="https://<your-convex-deployment>.convex.cloud"
     ```

   - `apps/mobile/.env`

     ```bash
     EXPO_PUBLIC_CONVEX_URL="https://<your-convex-deployment>.convex.cloud"
     ```

5. **Run the apps**

   ```bash
   npm run dev:convex
   npm run dev:web
   npm run dev:mobile
   ```

## What you can track

Each extraction captures:

- Dose in grams
- Yield in grams
- Extraction time in seconds
- Optional notes

The Convex backend stores each extraction per authenticated user, and both
clients display the most recent shots.
