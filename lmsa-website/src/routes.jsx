import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PortalLayout from './layouts/PortalLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import HistoryPage from './pages/public/HistoryPage';
import MissionVisionPage from './pages/public/MissionVisionPage';
import ConstitutionPage from './pages/public/ConstitutionPage';
import LeadershipPage from './pages/public/LeadershipPage';
import CommitteesPage from './pages/public/CommitteesPage';
import PastPresidentsPage from './pages/public/PastPresidentsPage';
import ExecutiveCouncilPage from './pages/public/ExecutiveCouncilPage';
import MembershipPage from './pages/public/MembershipPage';
import BenefitsPage from './pages/public/BenefitsPage';
import CategoriesPage from './pages/public/CategoriesPage';
import DuesPage from './pages/public/DuesPage';
import SymposiaPage from './pages/public/SymposiaPage';
import ResourcesPage from './pages/public/ResourcesPage';
import MentorshipPage from './pages/public/MentorshipPage';
import ResearchPage from './pages/public/ResearchPage';
import EventsPage from './pages/public/EventsPage';
import EventDetailPage from './pages/public/EventDetailPage';
import NewsPage from './pages/public/NewsPage';
import NewsDetailPage from './pages/public/NewsDetailPage';
import VolunteerPage from './pages/public/VolunteerPage';
import LeadershipOpportunitiesPage from './pages/public/LeadershipOpportunitiesPage';
import JoinCommitteePage from './pages/public/JoinCommitteePage';
import CommitteePageTemplate from './pages/committees/CommitteePageTemplate';
import PartnershipPage from './pages/public/PartnershipPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Portal pages
import DashboardPage from './pages/portal/DashboardPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CommitteeAdminDashboard from './pages/admin/CommitteeAdminDashboard';
import DocumentsAdminPage from './pages/admin/DocumentsAdminPage';
import MembershipAdminPage from './pages/admin/MembershipAdminPage';
import NewsAdminPage from './pages/admin/NewsAdminPage';
import EventsAdminPage from './pages/admin/EventsAdminPage';
import ExecutiveAdminPage from './pages/admin/ExecutiveAdminPage';

// Protected route wrapper
import ProtectedRoute from './components/common/ProtectedRoute';

function AppRoutes() {
  return (
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
        
        {/* Contact route */}
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
          <ProtectedRoute requireRole={['admin', 'executive', 'super_admin']}>
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
  );
}

export default AppRoutes;