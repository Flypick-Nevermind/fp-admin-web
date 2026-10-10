import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

/**
 * Route guard — renders children only when authenticated,
 * otherwise redirects to the login page.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const session = useAuthStore((s) => s.session);

  if (!session?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
