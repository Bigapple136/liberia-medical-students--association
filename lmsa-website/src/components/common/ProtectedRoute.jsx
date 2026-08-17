import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

/**
 * Route guard that verifies authentication and, optionally, role membership.
 *
 * Props:
 *   children   – the protected content
 *   requireRole – a role string (e.g. "admin") or an array of allowed roles
 *                 (e.g. ["admin", "super_admin"]).  If omitted, only
 *                 authentication is required.
 */
export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lmsa-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole) {
    const allowed = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowed.includes(user.role)) {
      return <Navigate to="/portal/dashboard" replace />;
    }
  }

  return children;
}
