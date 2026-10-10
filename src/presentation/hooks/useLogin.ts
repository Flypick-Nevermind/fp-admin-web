import { useCallback, useState } from 'react';
import type { LoginCredentials } from '@/core/entities/auth';
import type { AuthRepository } from '@/core/usecases/auth';
import { Login } from '@/core/usecases/login';
import { AuthRepositoryImpl } from '@/data/repositories/auth';
import { useAuthStore } from './useAuthStore';

/**
 * Presentation-layer composition root for auth.
 * The ONLY place that wires the domain AuthRepository port to the concrete
 * data-layer implementation. The use case stays decoupled.
 */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setError(null);
      setLoading(true);
      try {
        const repo: AuthRepository = new AuthRepositoryImpl();
        const useCase = new Login(repo);
        const session = await useCase.execute(credentials);
        setSession(session);
        return true;
      } catch (e) {
        const message =
          e instanceof Error && e.name === 'AuthApiError'
            ? e.message
            : e instanceof Error
              ? e.message
              : 'Something went wrong. Try again.';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setSession],
  );

  return { login, error, loading };
}
