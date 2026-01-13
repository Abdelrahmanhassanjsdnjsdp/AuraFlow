// Vercel Serverless Function: GET /api/route
// Calculates shortest path with optional avoidance
// Pure Node.js (no Express)

import { findShortestPath } from '../lib/graph.js';
import { getState } from '../lib/store.js';

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const from = parseInt(req.query.from, 10);
    const to = parseInt(req.query.to, 10);
    const avoidParam = req.query.avoid || '';

    // Validate input — DO NOT silently default
    if (isNaN(from) || from < 1 || from > 14) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid or missing from parameter (1-14)' }));
      return;
    }

    if (isNaN(to) || to < 1 || to > 14) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid or missing to parameter (1-14)' }));
      return;
    }

    // Parse avoid list and get congested roads from Redis
    const manualAvoid = avoidParam
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));

    let state;
    try {
      state = await getState();
    } catch (error) {
      console.error('Failed to get state from Redis:', error);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to retrieve routing state' }));
      return;
    }

    // Combine manual avoid and congested roads
    const blocked = new Set([...manualAvoid, ...state.congested]);

    // Calculate path
    const path = findShortestPath(from, to, blocked);

    if (!path) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'No path found between roads' }));
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.statusCode = 200;
    res.end(JSON.stringify({ path }));
  } catch (error) {
    console.error('Route calculation error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
