import { AdminLayout } from '@/presentation/components/AdminLayout';
import { DashboardPage } from '@/presentation/pages/Dashboard';
import { PlaceholderPage } from '@/presentation/pages/Placeholder';
import { LoginPage } from '@/presentation/pages/Login';
import { UnassignedCartsPage } from '@/presentation/pages/UnassignedCarts';
import { InactiveUsersPage } from '@/presentation/pages/InactiveUsers';
import { AssignedCartsPage } from '@/presentation/pages/AssignedCarts';
import { CartCreationDetailPage } from '@/presentation/pages/CartCreationDetail';
import { OrdersPage } from '@/presentation/pages/Orders';
import { OrderDetailPage } from '@/presentation/pages/OrderDetail';
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
      { path: 'unassigned-carts', element: <UnassignedCartsPage /> },
      { path: 'assigned-carts', element: <AssignedCartsPage /> },
      { path: 'carts/:id', element: <CartCreationDetailPage /> },
      { path: 'inactive-users', element: <InactiveUsersPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
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
