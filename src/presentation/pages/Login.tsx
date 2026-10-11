import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

/**
 * Full-page view — admin login.
 * Professional dark auth screen: centered card, clean inputs, accent CTA.
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
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="card card-hover p-8 flex flex-col gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-11 w-11 rounded-lg bg-accent-soft flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text">Sign in to fp-admin</h1>
              <p className="text-sm text-muted mt-1">
                Enter your credentials to access the dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Email</span>
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="you@corp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </label>

            {error && (
              <div className="text-xs font-medium text-danger bg-danger-soft border border-danger/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-subtle mt-5">
          Need access? Contact your workspace owner.
        </p>
      </div>
    </div>
  );
}
