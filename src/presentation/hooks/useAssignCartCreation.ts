import { useCallback, useState } from 'react';
import type { AssignCartCreationResult } from '@/core/entities/assignCartCreation';
import { AssignCartCreationUseCase } from '@/core/usecases/assignCartCreationUseCase';
import { AssignCartCreationRepositoryImpl } from '@/data/repositories/assignCartCreation';
import { getAccessToken, useAuthStore } from './useAuthStore';

/**
 * Presentation-layer composition root for the assign action.
 * Wires the domain port → concrete data-layer repo → use case. The
 * `user_admin_id` is the logged-in admin's own id (from the auth store);
 * the `Authorization` header (Bearer JWT) comes from the same store.
 */
export function useAssignCartCreation() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assign = useCallback(
    async (cartCreationId: string): Promise<AssignCartCreationResult | null> => {
      setError(null);

      const userAdminId = useAuthStore.getState().session?.adminId;
      if (!userAdminId) {
        setError('Not signed in.');
        return null;
      }

      setSubmitting(true);
      try {
        const repo = new AssignCartCreationRepositoryImpl();
        const useCase = new AssignCartCreationUseCase(repo);
        const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

        const result = await useCase.execute(
          { cartCreationId, userAdminId },
          auth,
        );
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to assign cart.');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { assign, submitting, error, clearError: () => setError(null) };
}
