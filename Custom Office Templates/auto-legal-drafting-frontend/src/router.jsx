import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// User Pages
import UserDashboardPage from './pages/user/UserDashboardPage';
import CreateDocumentPage from './pages/user/CreateDocumentPage';
import EditDocumentPage from './pages/user/EditDocumentPage';
import LawyerConnectPage from './pages/user/LawyerConnectPage';
import MyDocumentsPage from './pages/user/MyDocumentsPage';
import UserProfilePage from './pages/user/ProfilePage';

// Lawyer Pages
import LawyerDashboardPage from './pages/lawyer/LawyerDashboardPage';
import ReviewPage from './pages/lawyer/ReviewPage';
import LawyerProfilePage from './pages/lawyer/ProfilePage';
import EarningsPage from './pages/lawyer/EarningsPage';
import ReviewsPage from './pages/lawyer/ReviewsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import VerificationPage from './pages/admin/VerificationPage';
import ModerationPage from './pages/admin/ModerationPage';
import DisputePage from './pages/admin/DisputePage';
import SettingsPage from './pages/admin/SettingsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AuditPage from './pages/admin/AuditPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import LawyerManagementPage from './pages/admin/LawyerManagementPage';

// 404 Page
import NotFoundPage from './pages/404Page';
import AppLayout from './AppLayout';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <NotFoundPage />,
      children: [
        // Root redirect
        { path: '/', element: <Navigate to="/login" replace /> },

        // Public Routes
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <SignupPage /> },
        { path: '/forgot-password', element: <ForgotPasswordPage /> },

        // User Routes
        {
          path: '/user/dashboard',
          element: (
            <ProtectedRoute requiredRole="user">
              <UserDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/user/create-document',
          element: (
            <ProtectedRoute requiredRole="user">
              <CreateDocumentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/user/edit-document/:id',
          element: (
            <ProtectedRoute requiredRole="user">
              <EditDocumentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/user/lawyer-connect',
          element: (
            <ProtectedRoute requiredRole="user">
              <LawyerConnectPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/user/my-documents',
          element: (
            <ProtectedRoute requiredRole="user">
              <MyDocumentsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/user/profile',
          element: (
            <ProtectedRoute requiredRole="user">
              <UserProfilePage />
            </ProtectedRoute>
          ),
        },

        // Lawyer Routes
        {
          path: '/lawyer/dashboard',
          element: (
            <ProtectedRoute requiredRole="lawyer">
              <LawyerDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/lawyer/review/:requestId',
          element: (
            <ProtectedRoute requiredRole="lawyer">
              <ReviewPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/lawyer/profile',
          element: (
            <ProtectedRoute requiredRole="lawyer">
              <LawyerProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/lawyer/earnings',
          element: (
            <ProtectedRoute requiredRole="lawyer">
              <EarningsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/lawyer/reviews',
          element: (
            <ProtectedRoute requiredRole="lawyer">
              <ReviewsPage />
            </ProtectedRoute>
          ),
        },

        // Admin Routes
        {
          path: '/admin/dashboard',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/verification',
          element: (
            <ProtectedRoute requiredRole="admin">
              <VerificationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/moderation',
          element: (
            <ProtectedRoute requiredRole="admin">
              <ModerationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/disputes',
          element: (
            <ProtectedRoute requiredRole="admin">
              <DisputePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/settings',
          element: (
            <ProtectedRoute requiredRole="admin">
              <SettingsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/analytics',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AnalyticsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/audit',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AuditPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/users',
          element: (
            <ProtectedRoute requiredRole="admin">
              <UserManagementPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/lawyers',
          element: (
            <ProtectedRoute requiredRole="admin">
              <LawyerManagementPage />
            </ProtectedRoute>
          ),
        },

        // 404 Fallback
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
