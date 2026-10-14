import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { getHealth } from './controllers/productController.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow React Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.get('/api/health', getHealth);
app.use('/api/products', productRoutes);

// Root route for quick verification in browser
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MiniShop Inventory API 🚀',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      productById: '/api/products/:id',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong on the server',
  });
});

// Start Server and connect to Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🛍️ MiniShop Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    console.log(`==============================================\n`);
  });
};

startServer();

export default app;
