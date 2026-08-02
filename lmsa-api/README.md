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