import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

/**
 * Top-level admin layout: professional sidebar + content area.
 * Dark, muted, Linear/Vercel style. Pure presentation.
 */
const links = [
  { to: '/admin', label: 'Dashboard', icon: IconDashboard, exact: true },
  { to: '/admin/users', label: 'Users', icon: IconUsers, exact: false },
  { to: '/admin/unassigned-carts', label: 'Unassigned Carts', icon: IconCart, exact: false },
  { to: '/admin/assigned-carts', label: 'Assigned Carts', icon: IconCartCheck, exact: false },
  { to: '/admin/inactive-users', label: 'Inactive Users', icon: IconUsers, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: IconOrders, exact: false },
  { to: '/admin/settings', label: 'Settings', icon: IconSettings, exact: false },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const clearSession = useAuthStore((s) => s.clearSession);

  function logout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`shrink-0 border-r border-border bg-app-surface h-full transition-all duration-200 flex flex-col ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Brand */}
        <div
          className={`flex items-center h-14 border-b border-border ${
            collapsed ? 'justify-center' : 'gap-2.5 px-5'
          }`}
        >
          <div className="h-7 w-7 rounded-md bg-accent-soft flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-text">
              fp-admin
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto scroll-thin">
          {links.map((l) => {
            const Icon = l.icon;
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'text-text bg-accent-soft'
                    : 'text-muted hover:text-text hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-accent' : 'text-subtle group-hover:text-muted'}`} />
                {!collapsed && l.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-3 py-3 flex flex-col gap-2">
          {!collapsed && session && (
            <div className="px-3 pb-1">
              <p className="text-xs font-semibold text-text truncate">{session.userName}</p>
              <p className="text-[11px] text-subtle">Administrator</p>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              collapsed ? 'justify-center' : ''
            } text-muted hover:text-danger hover:bg-danger-soft`}
          >
            <IconLogout className="h-4 w-4 shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              collapsed ? 'justify-center' : ''
            } text-subtle hover:text-text hover:bg-white/[0.04]`}
          >
            {collapsed ? <IconExpand className="h-4 w-4" /> : <IconCollapse className="h-4 w-4" />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto scroll-thin bg-app-bg">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ---- Inline line icons (24x24) ---- */
type IconProps = { className?: string };
const svg = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconDashboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconUsers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconCart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L22 7H6" />
    </svg>
  );
}
function IconCartCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h5.3a2 2 0 0 0 1.9-1.4L22 8" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconOrders({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
function IconSettings({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconLogout({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
function IconCollapse({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconExpand({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
