const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./src/utils/logger');
const apiRouter = require('./src/api/router');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// -- MongoDB lazy connection (cached across warm lambda invocations)
let dbState = 'disconnected';

async function ensureMongo() {
  if (dbState === 'connected') return true;
  if (dbState === 'connecting') return false;
  if (!config.db.uri) {
    logger.warn('MONGODB_URI non defini');
    dbState = 'failed';
    return false;
  }
  dbState = 'connecting';
  try {
    await mongoose.connect(config.db.uri, {
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
    });
    dbState = 'connected';
    logger.info('MongoDB connecte');
    return true;
  } catch (err) {
    dbState = 'failed';
    logger.error(`MongoDB erreur: ${err.message}`);
    return false;
  }
}

// -- API routes
app.use('/api', async (req, res, next) => {
  // Skip DB for health check
  if (req.path === '/health') return next();
  const ok = await ensureMongo();
  if (!ok && dbState === 'failed') {
    return res.status(503).json({ error: 'Base de donnees indisponible. Reessayez dans quelques secondes.' });
  }
  next();
});
app.use('/api', apiRouter);

// -- Firebase Auth handler proxy
const https = require('https');
app.get('/__/auth/*', (req, res) => {
  const fbUrl = `https://betly-1a8e6.firebaseapp.com${req.originalUrl}`;
  https.get(fbUrl, (fbRes) => {
    res.status(fbRes.statusCode);
    Object.entries(fbRes.headers).forEach(([k, v]) => {
      if (!['transfer-encoding', 'connection'].includes(k.toLowerCase())) {
        res.setHeader(k, v);
      }
    });
    fbRes.pipe(res);
  }).on('error', (err) => {
    logger.error(`Firebase auth proxy error: ${err.message}`);
    res.status(502).send('Auth proxy error');
  });
});

// -- Serve static files from web/public/ (match.html etc.)
const PUBLIC = path.join(__dirname, 'web', 'public');
app.use(express.static(PUBLIC));

// -- Serve React frontend (built by Vite into web/dist/) — only if dist exists
const fs = require('fs');
const DIST = path.join(__dirname, 'web', 'dist');
if (fs.existsSync(path.join(DIST, 'index.html'))) {
  app.use(express.static(DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

// -- Export for Vercel serverless
module.exports = app;

// -- Local dev server
if (require.main === module) {
  ensureMongo().then(() => {
    const http = require('http');
    const server = http.createServer(app);

    // Socket.io integration
    const { attachSocket } = require('./src/utils/socket');
    attachSocket(server);

    server.listen(config.port, () => {
      logger.info(`WOLVES API sur le port ${config.port}`);
    });
  });
}
