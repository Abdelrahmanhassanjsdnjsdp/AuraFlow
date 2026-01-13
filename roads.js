// Vercel Serverless Function: GET /api/roads
// Returns road nodes and graph structure
// Pure Node.js (no Express)

import { ROAD_NODES, ROAD_GRAPH } from '../lib/graph.js';

export default function handler(req, res) {
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
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
  res.statusCode = 200;
  res.end(JSON.stringify({
    nodes: ROAD_NODES,
    graph: ROAD_GRAPH
  }));
}
