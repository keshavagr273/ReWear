require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const path      = require('path');

const app = express();

// ─── Database ─────────────────────────────────────────────────────────────────
const mongoUri = (process.env.MONGO_URI || '').trim().replace(/^["']|["']$/g, '');
if (!mongoUri) {
  console.error('❌ MONGO_URI environment variable is missing or empty.');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile, curl, Postman, health checks)
    if (!origin) return callback(null, true);

    // Allow configured origins, all Vercel deployments (*.vercel.app), and dev environments
    const isVercel = /\.vercel\.app$/.test(origin);
    const isAllowed = allowedOrigins.some((o) => origin === o || origin.startsWith(o));

    if (isAllowed || isVercel || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Fallback: allow request with credentials for public REST API
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/user',     require('./routes/user'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/upload',   require('./routes/upload'));
app.use('/api/orders',   require('./routes/orders'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ReWear API is running', version: '2.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ReWear server running on http://localhost:${PORT}`);
});