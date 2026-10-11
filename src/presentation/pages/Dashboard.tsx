import { StatCard } from '@/shared/components/StatCard';
import { StatCardSkeleton } from '@/shared/components/StatCardSkeleton';
import { ActiveUsersCard } from '@/shared/components/ActiveUsersCard';
import { InactiveUsersCard } from '@/shared/components/InactiveUsersCard';
import { useDashboardStats } from '@/presentation/hooks/useDashboard';

/**
 * Full-page view — the admin dashboard.
 * Professional layout: header + live metrics row + stat grid + activity card.
 */
export function DashboardPage() {
  const { stats, loading } = useDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-text">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Overview of your platform metrics
        </p>
      </header>

      {/* Live metrics: Active + Inactive users + first two dashboard stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActiveUsersCard />
        <InactiveUsersCard />
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.slice(0, 2).map((s) => <StatCard key={s.id} stat={s} />)}
      </div>

      {/* Remaining stat cards */}
      {!loading && stats.length > 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.slice(2).map((s) => (
            <StatCard key={s.id} stat={s} />
          ))}
        </div>
      )}

      <div className="card card-hover">
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-sm font-semibold text-text">Recent Activity</h3>
        </div>
        <ul className="px-5 pb-5 flex flex-col">
          {[
            { id: 'a1', actor: 'Admin', action: 'Updated user role for jane@corp.com', timestamp: '2 min ago' },
            { id: 'a2', actor: 'System', action: 'Auto-suspended inactive account', timestamp: '1 hr ago' },
            { id: 'a3', actor: 'Editor', action: 'Published new article draft', timestamp: '3 hrs ago' },
          ].map((a, i, arr) => (
            <li
              key={a.id}
              className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text truncate">
                  <span className="font-medium text-accent">{a.actor}</span>{' '}
                  {a.action}
                </p>
              </div>
              <span className="text-xs text-subtle shrink-0">{a.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
