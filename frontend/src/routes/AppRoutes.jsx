import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load pages
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminUsersList = lazy(() => import('../pages/AdminUsersList'));
const AdminStoresList = lazy(() => import('../pages/AdminStoresList'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const StoreOwnerDashboard = lazy(() => import('../pages/StoreOwnerDashboard'));
const ChangePassword = lazy(() => import('../pages/ChangePassword'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Protect routes for authenticated users and verify roles
const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : user.role === 'Store Owner' ? '/owner/dashboard' : '/user/dashboard'} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/user/dashboard" replace /> : <Register />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          {/* Default redirection based on user role */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={
                    user.role === 'Admin'
                      ? '/admin/dashboard'
                      : user.role === 'Store Owner'
                      ? '/owner/dashboard'
                      : '/user/dashboard'
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Admin Protected Routes */}
          <Route element={<RoleRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersList />} />
            <Route path="/admin/stores" element={<AdminStoresList />} />
          </Route>

          {/* Normal User Protected Routes */}
          <Route element={<RoleRoute allowedRoles={['User']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Store Owner Protected Routes */}
          <Route element={<RoleRoute allowedRoles={['Store Owner']} />}>
            <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
          </Route>

          {/* Shared Authenticated Routes */}
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
