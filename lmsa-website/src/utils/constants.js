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