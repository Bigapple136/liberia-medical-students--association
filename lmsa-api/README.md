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
- POST `/api/auth/reset-password` - Reset password### Users
- GET `/api/users/me` - Get current user (auth required)
- PUT `/api/users/me` - Update profile (auth required)
- GET `/api/users` - Get all users, with optional `?search=` and `?limit=` (admin only)
- GET `/api/users/:id` - Get user by ID (auth required)

### Committees
- GET `/api/committees` - List all committees (public)
- GET `/api/committees/:slug` - Get committee by slug (public)
- PUT `/api/committees/:id` - Update committee (admin)
- GET/POST/DELETE `/api/committees/:id/members` - Member management (admin)
- GET/POST/DELETE `/api/committees/:id/events` - Committee events (admin)
- GET/POST/DELETE `/api/committees/:id/documents` - Documents (admin)
- GET/POST/DELETE `/api/committees/:id/announcements` - Announcements (admin)
- GET/POST/DELETE `/api/committees/:id/achievements` - Achievements (admin)
- POST `/api/committees/:id/contact` - Contact form (public)
- POST `/api/committees/:id/subscribe` - Subscribe to updates (public)

### Events
- GET `/api/events` - List events, with optional `?type=`, `?status=`, `?upcoming=true` (public)
- GET `/api/events/:slug` - Get event by slug (public)
- POST/PUT/DELETE `/api/events` - Event management (admin)
- POST/DELETE `/api/events/:id/register` - Registration (auth required)
- GET `/api/events/:id/registrations` - List registrations (admin)

## Documentation

All project documentation is in the `/docs` folder:
- Technical Documentation
- Development Roadmap
- API Documentation
- Database Schema

## License

© 2026 Liberia Medical Students' Association