import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthSession } from '@/core/entities/auth';

/**
 * Presentation-layer auth state (Zustand) — persisted to localStorage.
 *
 * Why persist: the active JWT session must survive a full page refresh,
 * otherwise the router guard would bounce the user back to /login every
 * time they F5. Only the `session` slice is persisted (partialize) so we
 * don't leak actions to storage.
 */
interface AuthState {
  session: AuthSession | null;
  setSession: (s: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'fp-admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);

export const isAuthenticated = (state: AuthState) =>
  Boolean(state.session?.accessToken);

/**
 * Read the raw access token (JWT) without subscribing to the store.
 * Use this to build `Authorization: Bearer <token>` headers for API calls.
 */
export function getAccessToken(): string | null {
  return useAuthStore.getState().session?.accessToken ?? null;
}
