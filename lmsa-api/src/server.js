import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import middleware
import { errorHandler } from './middleware/error.middleware.js';
import { logger } from './middleware/logger.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import healthRoutes from './routes/health.routes.js';
import committeeRoutes from './routes/committee.routes.js';
import eventRoutes from './routes/event.routes.js';
import membershipRoutes from './routes/membership.routes.js';
import newsRoutes from './routes/news.routes.js';
import contactRoutes from './routes/contact.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import executiveRoutes from './routes/executive.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Render (and most PaaS hosts) sit behind a reverse proxy, so incoming
// requests carry an X-Forwarded-For header rather than a direct client
// IP. Without this, Express doesn't trust that header, which makes
// express-rate-limit unable to reliably identify individual clients
// (potential shared-bucket rate limiting across all users) and logs a
// warning on every request. `1` trusts exactly one hop -- Render's own
// proxy -- rather than blindly trusting the whole chain.
app.set('trust proxy', 1);

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Compression
app.use(compression());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(logger);

// Rate limiting
//
// A single 100-req/15min limit shared across the entire /api/ surface was
// too tight for normal use — every page load can fire several calls
// (profile fetch, committee data, events, etc.), and it applied the same
// strict budget to routine authenticated reads as to the endpoints where
// rate limiting actually matters (login/register, to slow down
// brute-force/spam). Split into two tiers instead.

// Strict limiter for auth endpoints specifically — this is where limiting
// genuinely matters (credential stuffing, registration spam).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many auth requests from this IP, please try again later.',
});
app.use('/api/auth', authLimiter);

// Generous general limiter for everything else under /api/ — high enough
// that normal browsing (multiple calls per page navigation) doesn't hit
// it, while still guarding against runaway/abusive request volume.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', generalLimiter);

// ============================================
// ROUTES
// ============================================

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/executive', executiveRoutes);

// Contact endpoint — public, unauthenticated, plausible spam target.
// Shares the same strict budget as auth routes (30/15min).
app.use('/api/contact', authLimiter, contactRoutes);

// Newsletter signup — public, unauthenticated, plausible spam target.
// Same strict budget as /api/contact (30/15min).
app.use('/api/newsletter', authLimiter, newsletterRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'LMSA API',
    version: '1.0.0',
    status: 'running',
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 LMSA API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

export default app;