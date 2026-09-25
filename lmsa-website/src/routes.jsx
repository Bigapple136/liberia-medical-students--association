import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PortalLayout from './layouts/PortalLayout';
import AdminLayout from './layouts/AdminLayout';
import { ADMIN_ROLES } from '@utils/constants';


// Public pages
// HomePage and NotFoundPage stay eager: HomePage is the index route hit by
// nearly every visit (avoids a loading flash on the most common page), and
// NotFoundPage is the tiny catch-all `*` route so it resolves instantly.
import HomePage from './pages/public/HomePage';
import NotFoundPage from './pages/public/NotFoundPage';
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const HistoryPage = lazy(() => import('./pages/public/HistoryPage'));
const MissionVisionPage = lazy(() => import('./pages/public/MissionVisionPage'));
const ConstitutionPage = lazy(() => import('./pages/public/ConstitutionPage'));
const LeadershipPage = lazy(() => import('./pages/public/LeadershipPage'));
const CommitteesPage = lazy(() => import('./pages/public/CommitteesPage'));
const PastPresidentsPage = lazy(() => import('./pages/public/PastPresidentsPage'));
const ExecutiveCouncilPage = lazy(() => import('./pages/public/ExecutiveCouncilPage'));
const MembershipPage = lazy(() => import('./pages/public/MembershipPage'));
const BenefitsPage = lazy(() => import('./pages/public/BenefitsPage'));
const CategoriesPage = lazy(() => import('./pages/public/CategoriesPage'));
const DuesPage = lazy(() => import('./pages/public/DuesPage'));
const SymposiaPage = lazy(() => import('./pages/public/SymposiaPage'));
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage'));
const MentorshipPage = lazy(() => import('./pages/public/MentorshipPage'));
const ResearchPage = lazy(() => import('./pages/public/ResearchPage'));
const EventsPage = lazy(() => import('./pages/public/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/public/EventDetailPage'));
const NewsPage = lazy(() => import('./pages/public/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/public/NewsDetailPage'));
const VolunteerPage = lazy(() => import('./pages/public/VolunteerPage'));
const LeadershipOpportunitiesPage = lazy(() => import('./pages/public/LeadershipOpportunitiesPage'));
const JoinCommitteePage = lazy(() => import('./pages/public/JoinCommitteePage'));
const CommitteePageTemplate = lazy(() => import('./pages/committees/CommitteePageTemplate'));
const PartnershipPage = lazy(() => import('./pages/public/PartnershipPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const DocumentsPage = lazy(() => import('./pages/public/DocumentsPage'));


// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));


// Portal pages
const DashboardPage = lazy(() => import('./pages/portal/DashboardPage'));


// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CommitteeAdminDashboard = lazy(() => import('./pages/admin/CommitteeAdminDashboard'));
const DocumentsAdminPage = lazy(() => import('./pages/admin/DocumentsAdminPage'));
const MembershipAdminPage = lazy(() => import('./pages/admin/MembershipAdminPage'));
const NewsAdminPage = lazy(() => import('./pages/admin/NewsAdminPage'));
const EventsAdminPage = lazy(() => import('./pages/admin/EventsAdminPage'));
const ExecutiveAdminPage = lazy(() => import('./pages/admin/ExecutiveAdminPage'));


// Protected route wrapper
import ProtectedRoute from './components/common/ProtectedRoute';

// Single Suspense boundary for the whole route tree — fallback reuses the
// spinner markup from ProtectedRoute.jsx's loading state.
function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lmsa-600" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          
          {/* About routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/history" element={<HistoryPage />} />
          <Route path="/about/mission-vision" element={<MissionVisionPage />} />
          <Route path="/about/constitution" element={<ConstitutionPage />} />
          
          {/* Leadership routes */}
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/leadership/committees" element={<CommitteesPage />} />
          <Route path="/leadership/committees/:slug" element={<CommitteePageTemplate />} />
          <Route path="/leadership/past-presidents" element={<PastPresidentsPage />} />
          <Route path="/leadership/executive-council" element={<ExecutiveCouncilPage />} />
          
          {/* Membership routes */}
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/membership/benefits" element={<BenefitsPage />} />
          <Route path="/membership/categories" element={<CategoriesPage />} />
          <Route path="/membership/dues" element={<DuesPage />} />
          
          {/* Academics routes */}
          <Route path="/academics/symposia" element={<SymposiaPage />} />
          <Route path="/academics/resources" element={<ResourcesPage />} />
          <Route path="/academics/mentorship" element={<MentorshipPage />} />
          <Route path="/academics/research" element={<ResearchPage />} />
          
          {/* Events routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          
          {/* News routes */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          
          {/* Get Involved routes */}
          <Route path="/get-involved/volunteer" element={<VolunteerPage />} />
          <Route path="/get-involved/leadership" element={<LeadershipOpportunitiesPage />} />
          <Route path="/get-involved/committees" element={<JoinCommitteePage />} />
          <Route path="/partnership" element={<PartnershipPage />} />
          
          {/* Documents route */}
          <Route path="/documents" element={<DocumentsPage />} />
          
          {/* Contact route */}
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
            <ProtectedRoute requireRole={ADMIN_ROLES}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="committees" element={<CommitteeAdminDashboard />} />
          <Route path="documents" element={<DocumentsAdminPage />} />
          <Route path="membership" element={<MembershipAdminPage />} />
          <Route path="news" element={<NewsAdminPage />} />
          <Route path="events" element={<EventsAdminPage />} />
          <Route path="leadership" element={<ExecutiveAdminPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
