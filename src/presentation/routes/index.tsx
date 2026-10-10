import { AdminLayout } from '@/presentation/components/AdminLayout';
import { DashboardPage } from '@/presentation/pages/Dashboard';
import { PlaceholderPage } from '@/presentation/pages/Placeholder';
import { LoginPage } from '@/presentation/pages/Login';
import { RequireAuth } from './RequireAuth';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

/**
 * Wrap a nested admin route tree in the auth guard.
 * If unauthenticated, redirect to /login (remembers where they came from).
 */
function ProtectedOutlet() {
  return (
    <RequireAuth>
      <AdminLayout />
    </RequireAuth>
  );
}

/**
 * Routing config — presentation layer.
 *
 *   /login         public
 *   /admin/**      protected (RequireAuth → AdminLayout → children)
 *   /              redirects to /admin (guard decides login vs dashboard)
 */
export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedOutlet />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'users', element: <PlaceholderPage title="Users" /> },
      { path: 'orders', element: <PlaceholderPage title="Orders" /> },
      { path: 'settings', element: <PlaceholderPage title="Settings" /> },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
]);
