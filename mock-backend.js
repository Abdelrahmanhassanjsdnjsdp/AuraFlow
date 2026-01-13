// Simple Mock Backend Server for Local Testing (ESM)
// This provides the API endpoints without needing Vercel or external dependencies

import http from 'http';
import url from 'url';

// Road nodes and graph (same as in lib/graph.js)
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

const ROAD_GRAPH = {
  1: [7],
  2: [3, 4],
  3: [2, 4, 5],
  4: [3, 5, 7],
  5: [3, 4, 6],
  6: [5],
  7: [1, 8, 11, 4],
  8: [7, 9, 11, 12],
  9: [8],
  10: [11],
  11: [7, 8, 10, 13, 4],
  12: [8, 14],
  13: [11, 14],
  14: [12, 13]
};

// In-memory state (for testing only)
let congestedRoads = [];
let version = 0;

// BFS shortest path algorithm
function findShortestPath(start, target, blocked = new Set()) {
  if (start === target) return [start];
  
  const queue = [start];
  const visited = new Set([start]);
  const prev = {};
  
  while (queue.length > 0) {
    const node = queue.shift();
    const neighbors = ROAD_GRAPH[node] || [];
    
    for (const neighbor of neighbors) {
      if (visited.has(neighbor) || blocked.has(neighbor)) continue;
      
      visited.add(neighbor);
      prev[neighbor] = node;
      
      if (neighbor === target) {
        const path = [neighbor];
        let current = neighbor;
        while (current !== start) {
          current = prev[current];
          path.push(current);
        }
        return path.reverse();
      }
      
      queue.push(neighbor);
    }
  }
  
  return null;
}

// Response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Create server
const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`);

  // GET /api/roads
  if (pathname === '/api/roads' && req.method === 'GET') {
    sendJSON(res, 200, { nodes: ROAD_NODES, graph: ROAD_GRAPH });
    return;
  }

  // GET /api/state
  if (pathname === '/api/state' && req.method === 'GET') {
    sendJSON(res, 200, {
      congested: congestedRoads,
      updatedAt: new Date().toISOString(),
      version
    });
    return;
  }

  // GET /api/route
  if (pathname === '/api/route' && req.method === 'GET') {
    const from = parseInt(query.from, 10);
    const to = parseInt(query.to, 10);
    const avoidParam = query.avoid || '';

    // Validate input
    if (isNaN(from) || from < 1 || from > 14) {
      sendJSON(res, 400, { error: 'Invalid or missing from parameter (1-14)' });
      return;
    }

    if (isNaN(to) || to < 1 || to > 14) {
      sendJSON(res, 400, { error: 'Invalid or missing to parameter (1-14)' });
      return;
    }

    // Parse avoid list
    const manualAvoid = avoidParam
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));

    // Combine manual avoid and congested roads
    const blocked = new Set([...manualAvoid, ...congestedRoads]);

    // Calculate path
    const path = findShortestPath(from, to, blocked);

    if (!path) {
      sendJSON(res, 404, { error: 'No path found between roads' });
      return;
    }

    sendJSON(res, 200, { path });
    return;
  }

  // POST /api/update
  if (pathname === '/api/update' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { congested } = data;

        if (!Array.isArray(congested)) {
          sendJSON(res, 400, { error: 'Missing or invalid "congested" array' });
          return;
        }

        // Validate road numbers
        congestedRoads = congested
          .filter(n => !isNaN(n))
          .filter(n => n >= 1 && n <= 14);

        version++;

        sendJSON(res, 200, {
          ok: true,
          congested: congestedRoads,
          updatedAt: new Date().toISOString(),
          version
        });
      } catch (error) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // Not found
  sendJSON(res, 404, { error: 'Endpoint not found' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('\n✅ Mock Backend Server Running!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('\n✨ Endpoints available:');
  console.log('   GET  /api/roads');
  console.log('   GET  /api/state');
  console.log('   GET  /api/route?from=1&to=12&avoid=7,8');
  console.log('   POST /api/update');
  console.log('\n🔗 Frontend: http://localhost:5173');
  console.log('\n✅ Ready for testing!\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});
