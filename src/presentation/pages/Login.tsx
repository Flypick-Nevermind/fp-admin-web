import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

/**
 * Full-page view — admin login.
 * Duolingo-style: centered card, thick rounded inputs, green CTA, friendly owl.
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useLogin();
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login({ userEmail: email, userPassword: password });
    if (ok) navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-duo-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="duo-card p-8 flex flex-col items-center gap-5">
          <span className="text-5xl">🦉</span>
          <div className="text-center">
            <h1 className="text-2xl font-black text-duo-text">Log in to continue</h1>
            <p className="text-sm font-bold text-duo-muted mt-1">
              fp-admin · admin dashboard
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-duo-muted">
                Email
              </span>
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="you@corp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full px-4 py-3 rounded-xl bg-duo-surface
                  border-2 border-duo-border text-duo-text font-bold
                  placeholder:font-semibold placeholder:text-duo-muted/60
                  focus:outline-none focus:border-duo-blue focus:bg-duo-bg
                  transition-colors
                "
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-duo-muted">
                Password
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full px-4 py-3 rounded-xl bg-duo-surface
                  border-2 border-duo-border text-duo-text font-bold
                  placeholder:font-semibold placeholder:text-duo-muted/60
                  focus:outline-none focus:border-duo-blue focus:bg-duo-bg
                  transition-colors
                "
              />
            </label>

            {error && (
              <p className="text-sm font-bold text-duo-red text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="duo-btn-primary px-8 py-3 text-base w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-bold text-duo-muted mt-4">
          Need access? Contact your workspace owner.
        </p>
      </div>
    </div>
  );
}
