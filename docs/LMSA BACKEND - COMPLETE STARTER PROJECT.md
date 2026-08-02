// ============================================
// LMSA BACKEND - COMPLETE STARTER PROJECT
// Repository: lmsa-api
// ============================================

// ============================================
// FILE: package.json
// ============================================
{
  "name": "lmsa-api",
  "version": "1.0.0",
  "type": "module",
  "description": "Backend API for LMSA website",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.js\""
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.0",
    "@supabase/supabase-js": "^2.39.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.8",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.3",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}

// ============================================
// FILE: .env.example
// ============================================
# Server
NODE_ENV=development
PORT=5000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_very_long_and_random
JWT_EXPIRES_IN=24h

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=lmsa@example.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=LMSA <lmsa@example.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf

// ============================================
// FILE: .eslintrc.json
// ============================================
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}

// ============================================
// FILE: .prettierrc
// ============================================
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}

// ============================================
// FILE: .gitignore
// ============================================
# Dependencies
node_modules/
npm-debug.log*

# Environment
.env
.env.local
.env.production

# Logs
logs/
*.log

# IDE
.vscode/
.idea/

# OS
.DS_Store

# Uploads
uploads/
temp/

// ============================================
// FILE: src/server.js
// ============================================
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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// ============================================
// ROUTES
// ============================================

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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

// ============================================
// FILE: src/config/supabase.js
// ============================================
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ============================================
// FILE: src/config/email.js
// ============================================
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// ============================================
// FILE: src/middleware/auth.middleware.js
// ============================================
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.sub)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    next();
  };
};

// ============================================
// FILE: src/middleware/error.middleware.js
// ============================================
export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ============================================
// FILE: src/middleware/logger.middleware.js
// ============================================
export const logger = (req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

// ============================================
// FILE: src/middleware/validate.middleware.js
// ============================================
import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  
  next();
};

// ============================================
// FILE: src/routes/health.routes.js
// ============================================
import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    const { error } = await supabase.from('users').select('count').limit(1);

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: error ? 'disconnected' : 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

// ============================================
// FILE: src/routes/auth.routes.js
// ============================================
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('year_level').isInt({ min: 1, max: 6 }).withMessage('Invalid year level'),
    validate,
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login
);

// Logout
router.post('/logout', authController.logout);

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    validate,
  ],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    validate,
  ],
  authController.resetPassword
);

export default router;

// ============================================
// FILE: src/routes/user.routes.js
// ============================================
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, userController.getCurrentUser);

// Update profile
router.put('/me', authenticate, userController.updateProfile);

// Get all users (admin only)
router.get('/', authenticate, authorize('admin', 'super_admin'), userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticate, userController.getUserById);

export default router;

// ============================================
// FILE: src/controllers/auth.controller.js
// ============================================
import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, full_name, year_level, student_id } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name,
      year_level,
      student_id,
      role: 'student',
      membership_status: 'pending',
    });

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user profile',
      });
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to LMSA',
      html: `
        <h1>Welcome to LMSA, ${full_name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>Please verify your email to complete registration.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Get user profile
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      success: true,
      token: data.session.access_token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

export const logout = async (_req, res) => {
  try {
    await supabase.auth.signOut();

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};

// ============================================
// FILE: src/controllers/user.controller.js
// ============================================
import { supabase } from '../config/supabase.js';

export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, bio } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name,
        phone,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update profile',
      });
    }

    res.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch users',
      });
    }

    res.json({
      success: true,
      users: data,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

// ============================================
// FILE: src/utils/helpers.js
// ============================================
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

// ============================================
// FILE: README.md
// ============================================
# LMSA API - Backend

Backend API for the Liberia Medical Students' Association (LMSA) website.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values

3. Start development server:
   ```bash
   npm run dev
   ```

4. API runs on http://localhost:5000

## Tech Stack

- Node.js 20
- Express 4
- Supabase (PostgreSQL)
- JWT Authentication
- Nodemailer

## API Endpoints

### Health
- GET `/api/health` - Health check

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Users
- GET `/api/users/me` - Get current user (auth required)
- PUT `/api/users/me` - Update profile (auth required)
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID (auth required)

## Documentation

All project documentation is in the `/docs` folder:
- Technical Documentation
- Development Roadmap
- API Documentation
- Database Schema

## License

© 2026 Liberia Medical Students' Association