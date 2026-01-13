// Vercel Serverless Function: POST /api/update
// Updates congestion state
// Pure Node.js (no Express)

import { setState } from '../lib/store.js';

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // req.body is already parsed by Vercel
    const body = req.body || {};
    const { congested } = body;

    // Validate congested array
    if (!Array.isArray(congested)) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing or invalid "congested" array in request body' }));
      return;
    }

    // Validate road numbers
    const validCongested = congested
      .filter(n => !isNaN(n))
      .filter(n => n >= 1 && n <= 14);

    // Update state in Redis
    const newState = await setState(validCongested);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      ...newState
    }));
  } catch (error) {
    console.error('Update error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Failed to update state' }));
  }
}
