# LMSA Website - Frontend

Official website for the Liberia Medical Students' Association (LMSA).

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

4. Open http://localhost:5173

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- React Router v6
- Supabase
- Axios

## Project Structure

- `src/pages/public/` — Public-facing pages (Home, About, Leadership, Committees, Events, etc.)
- `src/pages/committees/` — Dynamic committee page template (data-driven, fetches from API)
- `src/pages/admin/` — Admin dashboard and committee management interface
- `src/pages/portal/` — Member portal
- `src/pages/auth/` — Login and registration
- `src/layouts/` — Page layouts (Public, Admin, Portal)
- `src/services/` — API service layer (`committee.service.js`, `event.service.js`)
- `src/components/` — Shared UI components

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Documentation

All project documentation is in the `/docs` folder:
- Technical Documentation
- Development Roadmap
- Brand Guidelines
- Database Schema

## License

© 2026 Liberia Medical Students' Association