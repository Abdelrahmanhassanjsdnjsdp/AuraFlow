# AuraFlow Vercel Deployment Guide (Production-Ready)

## Architecture Overview

This is a **production-ready** backend refactored for Vercel Serverless Functions with Upstash Redis persistence.

| Component | Solution |
|-----------|----------|
| **Compute** | Vercel Serverless Functions (Node.js) |
| **State** | Upstash Redis (REST API) |
| **Real-time** | Polling (SSE removed) |
| **Routing** | BFS pathfinding with congestion avoidance |
| **API** | Pure Node.js (no Express) |

---

## Critical Changes from Local Development

### 1. No Long-Running Server
**Before (Local):**
```javascript
// ❌ NOT on Vercel
const server = http.createServer(...);
server.listen(3000);
```

**After (Vercel):**
```javascript
// ✅ Vercel functions
export default function handler(req, res) { ... }
```

### 2. No SSE (Server-Sent Events)
**Before:**
```javascript
// ❌ SSE not supported on Vercel serverless
res.write('data: ' + JSON.stringify(data) + '\n\n');
```

**After:**
```javascript
// ✅ Polling instead
GET /api/state → client polls every 5-10s
```

### 3. Pure Node.js Responses
**Before (Express style):**
```javascript
// ❌ Express not available
res.status(200).json(data);
```

**After (Pure Node.js):**
```javascript
// ✅ Pure Node.js
res.statusCode = 200;
res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(data));
```

### 4. No In-Memory State
**Before:**
```javascript
// ❌ Lost after cold restart
let congested = new Set([...]);
```

**After:**
```javascript
// ✅ Persisted in Upstash Redis
const state = await getState(); // Always fresh
```

---

## Why These Changes Matter

### SSE Removal
Vercel serverless functions have **hard timeouts** (60s default) and **no persistent connections**. Clients cannot maintain long-lived WebSocket or SSE connections. **Solution: Polling via stateless GET requests.**

### Redis Persistence
Each function invocation is **independent and ephemeral**. Without Redis, congestion state would be lost. Upstash Redis provides **REST-based persistence** that works across all function invocations.

### Pure Node.js
We don't use Express because:
- Adds unnecessary overhead for single endpoints
- Vercel natively invokes handler functions directly
- Pure Node.js is lighter and faster on serverless

---

## Folder Structure

```
e:/me/
├── api/                 # Serverless functions (REQUIRED)
│   ├── roads.js        # GET /api/roads
│   ├── route.js        # GET /api/route?from=&to=&avoid=
│   ├── state.js        # GET /api/state   (polling)
│   ├── update.js       # POST /api/update
│
├── lib/                 # Shared logic
│   ├── graph.js        # ROAD_NODES, ROAD_GRAPH, findShortestPath()
│   ├── store.js        # Upstash Redis + response helpers
│
├── src/                 # React frontend (Vite)
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│
├── vercel.json         # Vercel config
├── package.json        # Dependencies
├── VERCEL_DEPLOYMENT.md
└── public/
    └── ...
```

---

## API Endpoints (Production)

### GET /api/roads
Returns road network structure.

```bash
curl https://your-app.vercel.app/api/roads
```

**Response:**
```json
{
  "nodes": {
    "1": {"x": 740, "y": 400},
    "2": {"x": 740, "y": 120}
  },
  "graph": {
    "1": [7],
    "2": [3, 4]
  }
}
```

---

### GET /api/route
Calculates shortest path (avoids congested roads).

```bash
curl "https://your-app.vercel.app/api/route?from=1&to=12"
curl "https://your-app.vercel.app/api/route?from=1&to=12&avoid=2,3"
```

**Query Params:**
- `from` (required, 1-14) — starting road
- `to` (required, 1-14) — destination road
- `avoid` (optional) — comma-separated roads to avoid

**Response:**
```json
{ "path": [1, 7, 8, 12] }
```

**Errors:**
- `400` — invalid from/to
- `404` — no path found
- `500` — Redis unavailable

---

### GET /api/state
Polling endpoint for congestion state.

```bash
curl https://your-app.vercel.app/api/state
```

**Response:**
```json
{
  "congested": [2, 3],
  "updatedAt": "2026-01-13T20:45:00Z",
  "version": 42
}
```

**How to use:**
```javascript
// Client-side polling (every 5-10 seconds)
setInterval(async () => {
  const res = await fetch('/api/state');
  const { congested, version } = await res.json();
  
  // Only recalculate if version changed
  if (version > lastVersion) {
    recalculateRoute();
    lastVersion = version;
  }
}, 5000);
```

---

### POST /api/update
Update congestion state (called by AI model).

```bash
curl -X POST https://your-app.vercel.app/api/update \
  -H "Content-Type: application/json" \
  -d '{"congested":[7,8]}'
```

**Request Body:**
```json
{
  "congested": [7, 8]
}
```

**Response:**
```json
{
  "ok": true,
  "congested": [7, 8],
  "updatedAt": "2026-01-13T20:45:00Z",
  "version": 43
}
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Vercel CLI: `npm install -g vercel`
- Upstash Redis account (free): https://upstash.com

### Setup Steps

**1. Create Upstash Redis database:**
- Go to https://console.upstash.com
- Create free Redis database
- Copy REST URL and token

**2. Create `.env.local`:**
```
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**3. Install deps:**
```bash
npm install
```

**4. Run locally (both frontend + backend):**

**Terminal 1 — Frontend:**
```bash
npm run dev
# Vite runs on http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
vercel dev
# Serverless functions run on http://localhost:3000/api
```

**5. Test endpoints:**
```bash
# Test GET /api/roads
curl http://localhost:3000/api/roads

# Test GET /api/route
curl "http://localhost:3000/api/route?from=1&to=12"

# Test GET /api/state
curl http://localhost:3000/api/state

# Test POST /api/update
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{"congested":[7,8]}'
```

---

## Production Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "production: serverless backend ready for Vercel"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: GitHub Import (Recommended)**
1. Go to https://vercel.com/new
2. Select your GitHub repo
3. Vercel auto-detects Next.js/Vite project
4. Add environment variables (see below)
5. Click **Deploy**

**Option B: CLI**
```bash
vercel --prod \
  --env UPSTASH_REDIS_REST_URL=https://... \
  --env UPSTASH_REDIS_REST_TOKEN=... \
  --env CORS_ORIGIN=https://your-domain.com
```

### Step 3: Set Environment Variables on Vercel

Go to **Project Settings** → **Environment Variables**:

| Key | Value | Example |
|-----|-------|---------|
| `UPSTASH_REDIS_REST_URL` | Your Upstash URL | `https://us1-brave-leopard-123.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash token | `AXX...` |
| `CORS_ORIGIN` | Your frontend URL | `https://app.example.com` |

### Step 4: Update Frontend API Base

In `src/App.jsx` or create `.env.production`:

```javascript
// Before (localhost)
const apiBase = 'http://localhost:3000';

// After (Vercel)
const apiBase = 'https://your-app.vercel.app';
```

Or use environment variable:
```javascript
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Create `env.production`:
```
VITE_API_URL=https://your-app.vercel.app
```

---

## Monitoring & Debugging

### View Logs
```bash
vercel logs --follow
```

### Check Upstash Redis Usage
- Go to https://console.upstash.com
- View your database stats
- Monitor request counts and latency

### Common Issues

| Issue | Solution |
|-------|----------|
| `Redis connection failed` | Check `UPSTASH_REDIS_REST_URL` and token in Vercel env |
| `CORS error` | Ensure `CORS_ORIGIN` includes your frontend URL |
| `No path found` | All roads might be congested; check `/api/state` |
| `500 error` | Check Vercel logs: `vercel logs --follow` |

---

## Polling Interval Recommendation

Client should poll `/api/state` **every 5-10 seconds**:

```javascript
// Too frequent: wastes quota, increases cost
setInterval(poll, 1000); // ❌ 1 second

// Recommended: good balance
setInterval(poll, 5000); // ✅ 5 seconds

// Too infrequent: users see stale data
setInterval(poll, 30000); // ⚠️ 30 seconds
```

---

## Upstash Redis Rate Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Requests/day | 100 |
| Connections | 10 |
| DB size | 1 GB |
| Commands/sec | 10 |

**Tip:** Cache `/api/state` responses on the client for 5 seconds to reduce API calls.

---

## Removal of Legacy Code

The following is **NO LONGER USED**:
- `server/index.js` (old Node.js http.createServer)
- `/api/stream.js` (old SSE endpoint)
- In-memory state variables

These are kept in the repo for reference only.

---

## Next Steps

1. **Deploy frontend + backend to Vercel**
2. **Connect AI model to `POST /api/update`**
3. **Wire frontend to poll `/api/state` every 5s**
4. **Monitor logs & Upstash usage**
5. **Scale as needed**

---

## Support

For issues:
- Vercel docs: https://vercel.com/docs/functions/serverless-functions
- Upstash docs: https://upstash.com/docs/redis/overall/getstarted
- GitHub issues: [Your repo]
