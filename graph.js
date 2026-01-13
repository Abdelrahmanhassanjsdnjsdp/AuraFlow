// Road nodes and graph definition for AuraFlow routing engine
// ESM module — compatible with Vercel serverless functions

export const ROAD_NODES = {
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

export const ROAD_GRAPH = {
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

/**
 * BFS shortest path finder with optional blocked roads.
 * @param {number} start - Starting road number
 * @param {number} target - Destination road number
 * @param {Set<number>} blocked - Set of road numbers to avoid
 * @returns {number[]|null} Shortest path array or null if no path
 */
export function findShortestPath(start, target, blocked = new Set()) {
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
        // Reconstruct path
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
  
  return null; // No path found
}
