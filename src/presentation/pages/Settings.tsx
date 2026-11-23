import { NavLink, Outlet } from 'react-router-dom';

const settingsTabs = [
  {
    to: '/admin/settings/exchange-rate',
    label: 'Exchange Rate',
    description: 'CNY to IDR conversion rate (Kurs)',
  },
];

/**
 * Settings shell page — provides sub-page navigation and renders the active
 * settings sub-page via <Outlet />.
 */
export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-text">Settings</h1>
        <p className="text-sm text-muted mt-1">
          Configure platform-wide parameters and operational rules
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <nav
          aria-label="Settings sections"
          className="lg:col-span-3 card p-2 flex flex-col gap-1"
        >
          {settingsTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col gap-0.5 px-3 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent-soft text-text'
                    : 'text-muted hover:text-text hover:bg-white/[0.04]'
                }`
              }
            >
              <span className="text-sm font-medium">{tab.label}</span>
              <span className="text-xs text-subtle">{tab.description}</span>
            </NavLink>
          ))}
        </nav>

        <div className="lg:col-span-9 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
