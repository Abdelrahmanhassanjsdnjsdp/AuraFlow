export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    hasUrl: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    hasToken: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    corsOrigin: process.env.CORS_ORIGIN || null
  }));
}
