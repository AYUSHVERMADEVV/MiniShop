import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { getHealth } from './controllers/productController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '../../client');

// Load environment variables from .env (root and server directories)
dotenv.config({ override: true });
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.get('/api/health', getHealth);
app.use('/api/products', productRoutes);

// Fallback error handler for Mongoose connection drops
app.use((err, req, res, next) => {
  if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out'))) {
    console.warn('[AI Studio] Database offline — handling route gracefully');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? { success: true, count: 0, summary: {}, data: [] } : { success: true, data: {} });
    }
    return res.status(503).json({ success: false, error: 'Database temporarily unavailable' });
  }
  next(err);
});

// Setup Frontend Serving (Vite in dev, static dist in production)
const setupFrontend = async () => {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(clientRoot, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(clientRoot, 'dist/index.html'));
    });
  } else {
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        root: clientRoot,
        server: {
          middlewareMode: true,
          hmr: false,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite middleware initialization notice, falling back to static dist:', err.message);
      app.use(express.static(path.resolve(clientRoot, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(clientRoot, 'dist/index.html'));
      });
    }
  }

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack || err);
    res.status(err.status || 500).json({
      success: false,
      error: err.name || 'Internal Server Error',
      message: err.message || 'Something went wrong on the server',
    });
  });
};

// Start Server and connect to Database
const startServer = async () => {
  await connectDB();
  await setupFrontend();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==============================================`);
    console.log(`🛍️ MiniShop Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Health Check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`📦 Products API: http://0.0.0.0:${PORT}/api/products`);
    console.log(`==============================================\n`);
  });
};

startServer();

export default app;
