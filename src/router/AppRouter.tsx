// Router configuration with protected routes
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load components for code splitting
const LandingPage = lazy(() => import('../pages/LandingPage'));
const TemplateGallery = lazy(() => import('../pages/TemplateGallery'));
const TemplatePreviewPage = lazy(() => import('../pages/TemplatePreviewPage'));
const InvitationViewPage = lazy(() => import('../pages/InvitationViewPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const PreviewPage = lazy(() => import('../pages/PreviewPage'));
const PublishPage = lazy(() => import('../pages/PublishPage'));
const PublicInvitation = lazy(() => import('../pages/PublicInvitation'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplateGallery />} />
            <Route path="/template-preview/:templateId" element={<TemplatePreviewPage />} />
            <Route path="/invitation-view/:templateId" element={<InvitationViewPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/invitation/:slug" element={<PublicInvitation />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview/:id"
              element={
                <ProtectedRoute>
                  <PreviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publish/:id"
              element={
                <ProtectedRoute>
                  <PublishPage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect old paths */}
            <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;