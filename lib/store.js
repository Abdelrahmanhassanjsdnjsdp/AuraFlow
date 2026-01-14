// Upstash Redis store for AuraFlow state persistence
// Handles congestion state, timestamps, and versioning
// Pure Node.js (no Express) — compatible with Vercel serverless

import { Redis } from '@upstash/redis';

// Initialize Redis client from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// Redis key names
const CONGESTED_KEY = 'auraflow:congested';
const UPDATED_AT_KEY = 'auraflow:updatedAt';
const VERSION_KEY = 'auraflow:version';

/**
 * Get current congestion state from Redis
 * @returns {Promise<{congested: number[], updatedAt: string, version: number}>}
 */
export async function getState() {
  try {
    const [congestedStr, updatedAt, versionStr] = await Promise.all([
      redis.get(CONGESTED_KEY),
      redis.get(UPDATED_AT_KEY),
      redis.get(VERSION_KEY)
    ]);

    return {
      congested: congestedStr ? JSON.parse(congestedStr) : [],
      updatedAt: updatedAt || new Date().toISOString(),
      version: parseInt(versionStr || '0', 10)
    };
  } catch (error) {
    console.error('Redis get error:', error);
    throw new Error('Failed to retrieve state from Redis');
  }
}

/**
 * Update congestion state in Redis
 * @param {number[]} congestedRoads - Array of congested road numbers
 * @returns {Promise<{congested: number[], updatedAt: string, version: number}>}
 */
export async function setState(congestedRoads = []) {
  try {
    const now = new Date().toISOString();
    const currentVersion = await redis.incr(VERSION_KEY);

    await Promise.all([
      redis.set(CONGESTED_KEY, JSON.stringify(congestedRoads)),
      redis.set(UPDATED_AT_KEY, now),
      redis.set(VERSION_KEY, currentVersion.toString())
    ]);

    return {
      congested: congestedRoads,
      updatedAt: now,
      version: currentVersion
    };
  } catch (error) {
    console.error('Redis set error:', error);
    throw new Error('Failed to update congestion state');
  }
}

/**
 * Helper to send CORS-compliant JSON response (pure Node.js)
 * @param {object} res - Vercel response object
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Response payload
 */
export function sendJSON(res, statusCode, data) {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const origins = corsOrigin.split(',').map(o => o.trim());
  const origin = res.req?.headers?.origin || '';
  
  // Allow origin if in list or if wildcard
  if (origins.includes(origin) || origins.includes('*') || origins.includes('http://localhost:5173')) {
    res.setHeader('Access-Control-Allow-Origin', origin || 'http://localhost:5173');
  }
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

/**
 * Helper to send error response (pure Node.js)
 * @param {object} res - Vercel response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
export function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { error: message });
}
