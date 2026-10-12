import { useCallback, useState } from 'react';
import type {
  UpdateCartCreationCommand,
  UpdateCartCreationResult,
} from '@/core/entities/cartCreationUpdate';
import { UpdateCartCreationUseCase } from '@/core/usecases/updateCartCreationUseCase';
import { UpdateCartCreationRepositoryImpl } from '@/data/repositories/cartCreationUpdate';
import { getAccessToken, useAuthStore } from './useAuthStore';

/**
 * Presentation-layer composition root for the cart-creation update action.
 * Wires the domain port → concrete data-layer repo → use case. The
 * `user_admin_id` is the logged-in admin's own id (from the auth store);
 * the `Authorization` header (Bearer JWT) comes from the same store.
 *
 * Unlike the assign action, `update` RE-THROWS on failure so calling
 * editors can surface the error inline; the hook also tracks the last
 * error and the submitting flag for page-level use.
 */
export function useUpdateCartCreation() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (
      command: Omit<UpdateCartCreationCommand, 'userAdminId'>,
    ): Promise<UpdateCartCreationResult> => {
      const userAdminId = useAuthStore.getState().session?.adminId;
      if (!userAdminId) {
        const message = 'Not signed in.';
        setError(message);
        throw new Error(message);
      }

      setError(null);
      setSubmitting(true);
      try {
        // Composition root built inside the callback so it stays stable
        // and is constructed lazily, matching the sibling hooks.
        const repo = new UpdateCartCreationRepositoryImpl();
        const useCase = new UpdateCartCreationUseCase(repo);
        const auth = getAccessToken()
          ? `Bearer ${getAccessToken()}`
          : undefined;

        return await useCase.execute(
          { ...command, userAdminId },
          auth,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update cart creation.');
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { update, submitting, error, clearError: () => setError(null) };
}
