import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

/**
 * Top-level admin layout: Duolingo-style sidebar + content area.
 * Pure presentation — no business logic.
 */
export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const clearSession = useAuthStore((s) => s.clearSession);

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '▣' },
    { to: '/admin/users', label: 'Users', icon: '☺' },
    { to: '/admin/unassigned-carts', label: 'Unassigned Carts', icon: '🛒' },
    { to: '/admin/inactive-users', label: 'Inactive Users', icon: '👥' },
    { to: '/admin/orders', label: 'Orders', icon: '▤' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙' },
  ];

  function logout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-screen bg-duo-surface overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          shrink-0 border-r-2 border-duo-border bg-duo-bg
          ${collapsed ? 'w-20' : 'w-60'}
          h-full transition-all duration-200 flex flex-col
        `}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="text-3xl">🦉</span>
          {!collapsed && (
            <span className="text-xl font-extrabold text-duo-text tracking-tight">
              fp-admin
            </span>
          )}
        </div>

        <nav className="flex-1 min-h-0 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {links.map((l) => {
            const active =
              l.to === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(l.to);
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-extrabold
                  transition-colors
                  ${
                    active
                      ? 'bg-duo-green/15 text-duo-green-dark'
                      : 'text-duo-muted hover:bg-duo-surface hover:text-duo-text'
                  }
                `}
              >
                <span className="text-lg w-6 text-center">{l.icon}</span>
                {!collapsed && l.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="m-3 mb-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-extrabold
                   bg-duo-red/10 text-duo-red hover:bg-duo-red/20 transition-colors"
        >
          <span className="text-lg w-6 text-center">↩</span>
          {!collapsed && 'Log out'}
        </button>

        {!collapsed && (
          <div className="px-3 pb-2 text-xs font-bold text-duo-muted truncate">
            {session?.userName ?? '—'}
          </div>
        )}

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-3 py-2 rounded-xl text-xs font-extrabold text-duo-muted
                   border-2 border-duo-border bg-duo-bg
                   hover:bg-duo-surface transition-colors"
        >
          {collapsed ? '»' : '«  Collapse'}
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
