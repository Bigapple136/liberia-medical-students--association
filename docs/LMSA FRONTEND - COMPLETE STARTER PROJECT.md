// ============================================
// LMSA FRONTEND - COMPLETE STARTER PROJECT
// Repository: lmsa-website
// ============================================

// ============================================
// FILE: package.json
// ============================================
{
  "name": "lmsa-website",
  "version": "1.0.0",
  "type": "module",
  "description": "Official website for Liberia Medical Students' Association",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.5",
    "date-fns": "^3.2.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "lucide-react": "^0.309.0",
    "react-hot-toast": "^2.4.1",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.11",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.4"
  }
}

// ============================================
// FILE: .env.example
// ============================================
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=LMSA
VITE_APP_URL=http://localhost:5173

// ============================================
// FILE: vite.config.js
// ============================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});

// ============================================
// FILE: tailwind.config.js
// ============================================
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LMSA Brand Colors
        lmsa: {
          50: '#E8F7F0',
          100: '#C1E8D6',
          200: '#9ADABC',
          400: '#4DB68E',
          600: '#0C8950', // Primary brand color
          700: '#0A7343',
          800: '#085C36',
          900: '#064629',
        },
        // Supporting colors
        red: {
          600: '#DC143C', // Liberian flag red
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': '48px',
      },
    },
  },
  plugins: [],
}

// ============================================
// FILE: postcss.config.js
// ============================================
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// ============================================
// FILE: .eslintrc.json
// ============================================
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
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
  "printWidth": 80,
  "arrowParens": "avoid"
}

// ============================================
// FILE: .gitignore
// ============================================
# Dependencies
node_modules/
.pnpm-debug.log*

# Production
dist/
build/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

// ============================================
// FILE: index.html
// ============================================
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Official website of the Liberia Medical Students' Association (LMSA) - A.M. Dogliotti College of Medicine" />
    <title>LMSA - Liberia Medical Students' Association</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// ============================================
// FILE: src/main.jsx
// ============================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================
// FILE: src/App.jsx
// ============================================
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@context/AuthContext';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1F2937',
            },
            success: {
              iconTheme: {
                primary: '#0C8950',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

// ============================================
// FILE: src/routes.jsx
// ============================================
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import PortalLayout from '@/layouts/PortalLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Public pages
import HomePage from '@pages/public/HomePage';
import AboutPage from '@pages/public/AboutPage';
import LeadershipPage from '@pages/public/LeadershipPage';
import MembershipPage from '@pages/public/MembershipPage';
import ContactPage from '@pages/public/ContactPage';
import NotFoundPage from '@pages/public/NotFoundPage';

// Auth pages
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';

// Portal pages
import DashboardPage from '@pages/portal/DashboardPage';

// Admin pages
import AdminDashboard from '@pages/admin/AdminDashboard';

// Protected route wrapper
import ProtectedRoute from '@components/common/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Portal routes - Protected */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <PortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>

      {/* Admin routes - Protected & Role-based */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

// ============================================
// FILE: src/styles/index.css
// ============================================
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-200;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 font-sans antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold;
  }
  
  h1 {
    @apply text-5xl;
  }
  
  h2 {
    @apply text-4xl;
  }
  
  h3 {
    @apply text-3xl;
  }
}

@layer components {
  .btn {
    @apply px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply bg-lmsa-600 text-white hover:bg-lmsa-700 focus:ring-lmsa-500;
  }
  
  .btn-secondary {
    @apply bg-transparent border-2 border-lmsa-600 text-lmsa-600 hover:bg-lmsa-50 focus:ring-lmsa-500;
  }
  
  .input {
    @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lmsa-500 focus:border-transparent;
  }
  
  .card {
    @apply bg-white rounded-xl border border-gray-200 p-6 shadow-sm;
  }
}

// ============================================
// FILE: src/utils/constants.js
// ============================================
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LMSA';
export const API_URL = import.meta.env.VITE_API_URL;
export const APP_URL = import.meta.env.VITE_APP_URL;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LEADERSHIP: '/leadership',
  MEMBERSHIP: '/membership',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  PORTAL_DASHBOARD: '/portal/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  EXECUTIVE: 'executive',
  SUPER_ADMIN: 'super_admin',
};

export const MEMBERSHIP_TYPES = {
  FULL: 'full',
  ASSOCIATE: 'associate',
  HONORARY: 'honorary',
  VETERAN: 'veteran',
};

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// ============================================
// FILE: src/services/supabase.js
// ============================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// FILE: src/services/api.js
// ============================================
import axios from 'axios';
import { API_URL } from '@utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('lmsa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lmsa_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// FILE: src/services/auth.service.js
// ============================================
import api from './api';
import { supabase } from './supabase';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    localStorage.setItem('lmsa_token', data.session.access_token);
    return data;
  },

  // Logout user
  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('lmsa_token');
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    return response.data;
  },
};

// ============================================
// FILE: src/context/AuthContext.jsx
// ============================================
import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '@services/auth.service';
import { supabase } from '@services/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    login: authService.login,
    logout: authService.logout,
    register: authService.register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ============================================
// FILE: src/components/common/Button.jsx
// ============================================
export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button',
  className = '',
  ...props 
}) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================
// FILE: src/components/common/Input.jsx
// ============================================
import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// ============================================
// FILE: src/components/common/Card.jsx
// ============================================
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

// ============================================
// FILE: src/components/common/ProtectedRoute.jsx
// ============================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lmsa-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Add role checking logic here if requireRole is provided
  
  return children;
}

// ============================================
// FILE: src/components/layout/Header.jsx
// ============================================
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-lmsa-600">LMSA</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-lmsa-600">
              About
            </Link>
            <Link to="/leadership" className="text-gray-700 hover:text-lmsa-600">
              Leadership
            </Link>
            <Link to="/membership" className="text-gray-700 hover:text-lmsa-600">
              Membership
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-lmsa-600">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-lmsa-600">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Join LMSA
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/about" className="block text-gray-700">
              About
            </Link>
            <Link to="/leadership" className="block text-gray-700">
              Leadership
            </Link>
            <Link to="/membership" className="block text-gray-700">
              Membership
            </Link>
            <Link to="/contact" className="block text-gray-700">
              Contact
            </Link>
            <Link to="/login" className="block text-gray-700">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary w-full">
              Join LMSA
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================
// FILE: src/components/layout/Footer.jsx
// ============================================
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">LMSA</h3>
            <p className="text-sm text-gray-600">
              Liberia Medical Students' Association<br />
              A.M. Dogliotti College of Medicine<br />
              University of Liberia
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-lmsa-600">About LMSA</Link></li>
              <li><Link to="/leadership" className="text-gray-600 hover:text-lmsa-600">Leadership</Link></li>
              <li><Link to="/membership" className="text-gray-600 hover:text-lmsa-600">Membership</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="text-gray-600 hover:text-lmsa-600">Join LMSA</Link></li>
              <li><Link to="/portal" className="text-gray-600 hover:text-lmsa-600">Member Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-lmsa-600">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-lmsa-600">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-lmsa-600">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Liberia Medical Students' Association. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ============================================
// FILE: src/layouts/PublicLayout.jsx
// ============================================
import { Outlet } from 'react-router-dom';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ============================================
// FILE: src/layouts/PortalLayout.jsx
// ============================================
import { Outlet } from 'react-router-dom';

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar will go here */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
            <h2 className="font-bold text-lg">Portal</h2>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ============================================
// FILE: src/layouts/AdminLayout.jsx
// ============================================
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin sidebar will go here */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
            <h2 className="font-bold text-lg">Admin Panel</h2>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ============================================
// FILE: src/pages/public/HomePage.jsx
// ============================================
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-lmsa-600 text-white text-sm rounded-full mb-6">
            Established 1972
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            The Voice of Medical Students in Liberia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Uniting future physicians at A.M. Dogliotti College of Medicine to promote 
            excellence, advocate for student welfare, and advance healthcare in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" className="w-full sm:w-auto">
                Become a Member
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-gray-600">Supporting medical students through four core pillars</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                <p className="text-gray-600 text-sm">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const pillars = [
  {
    icon: '📚',
    title: 'Academic Excellence',
    description: 'Study resources, symposia, mentorship programs, and academic support'
  },
  {
    icon: '🎓',
    title: 'Professional Development',
    description: 'Leadership opportunities, research support, and international exchanges'
  },
  {
    icon: '🤝',
    title: 'Student Welfare',
    description: 'Advocacy, grievance support, mental health resources, and accommodation'
  },
  {
    icon: '🌍',
    title: 'Community Impact',
    description: 'Medical camps, blood drives, health education, and outreach programs'
  }
];

// ============================================
// FILE: src/pages/auth/LoginPage.jsx
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/portal/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your LMSA account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-lmsa-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// FILE: README.md
// ============================================
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

See `/docs` folder for complete technical documentation.

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