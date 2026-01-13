// Lightweight backend for AuraFlow
// No external dependencies — run with `node server/index.js`

const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

// In-memory representation of nodes and graph (mirror of client)
const ROAD_NODES = {
  1: { x: 740, y: 400 },
  2: { x: 740, y: 120 },
  3: { x: 480, y: 120 },
  4: { x: 400, y: 40 },
  5: { x: 240, y: 120 },
  6: { x: 240, y: 40 },
  7: { x: 520, y: 400 },
  8: { x: 320, y: 400 },
  9: { x: 80, y: 400 },
  10: { x: 740, y: 600 },
  11: { x: 400, y: 520 },
  12: { x: 240, y: 600 },
  13: { x: 480, y: 680 },
  14: { x: 200, y: 680 }
};

let ROAD_GRAPH = {
  1: [7],
  2: [3,4],
  3: [2,4,5],
  4: [3,5,7],
  5: [3,4,6],
  6: [5],
  7: [1,8,11,4],
  8: [7,9,11,12],
  9: [8],
  10: [11],
  11: [7,8,10,13,4],
  12: [8,14],
  13: [11,14],
  14: [12,13]
};

let congested = new Set();
// SSE clients set
const sseClients = new Set();

function findShortestPath(start, target, blocked = new Set()) {
  if (start === target) return [start];
  const q = [start];
  const visited = new Set([start]);
  const prev = {};
  while (q.length) {
    const node = q.shift();
    const neighbors = ROAD_GRAPH[node] || [];
    for (const n of neighbors) {
      if (visited.has(n) || blocked.has(n)) continue;
      visited.add(n);
      prev[n] = node;
      if (n === target) {
        const path = [n];
        let cur = n;
        while (cur !== start) {
          cur = prev[cur];
          path.push(cur);
        }
        return path.reverse();
      }
      q.push(n);
    }
  }
  return null;
}

function sendJSON(res, code, payload) {
  const body = JSON.stringify(payload || {});
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const { pathname, query } = parsed;

  if (req.method === 'OPTIONS') {
    // CORS preflight
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (pathname === '/api/roads' && req.method === 'GET') {
    return sendJSON(res, 200, { nodes: ROAD_NODES, graph: ROAD_GRAPH });
  }

  if (pathname === '/api/stream' && req.method === 'GET') {
    // Server-Sent Events endpoint
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    // send initial state
    res.write(`data: ${JSON.stringify({ type: 'init', congested: Array.from(congested) })}\n\n`);
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  if (pathname === '/api/route' && req.method === 'GET') {
    const from = Number(query.from || 1);
    const to = Number(query.to);
    const avoid = (query.avoid || '').split(',').map(s => Number(s)).filter(Boolean);
    const blocked = new Set(avoid.concat(Array.from(congested)));
    if (!ROAD_NODES[to]) return sendJSON(res, 400, { error: 'Invalid target' });
    const path = findShortestPath(from, to, blocked);
    if (!path) return sendJSON(res, 404, { error: 'No path found' });
    return sendJSON(res, 200, { path });
  }

  if (pathname === '/api/update' && req.method === 'POST') {
    // Accept JSON body: { congested: [2,3], updates: {...} }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (Array.isArray(data.congested)) {
          congested = new Set(data.congested.map(Number).filter(Boolean));
        }
        // optional: accept new graph or node positions
        if (data.graph) {
          ROAD_GRAPH = data.graph;
        }
        // broadcast to SSE clients
        const payload = JSON.stringify({ type: 'update', congested: Array.from(congested) });
        for (const client of sseClients) {
          try { client.write(`data: ${payload}\n\n`); } catch (e) { /* ignore */ }
        }

        return sendJSON(res, 200, { ok: true, congested: Array.from(congested) });
      } catch (err) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // default: not found
  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`AuraFlow backend listening on http://localhost:${PORT}`);
});
