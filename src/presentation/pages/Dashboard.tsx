import { StatCard } from '@/shared/components/StatCard';
import { StatCardSkeleton } from '@/shared/components/StatCardSkeleton';
import { useDashboardStats } from '@/presentation/hooks/useDashboard';

/**
 * Full-page view — the admin dashboard.
 * Uses a presentation hook that wires domain usecases to the data layer.
 */
export function DashboardPage() {
  const { stats, loading } = useDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold text-duo-text">Dashboard</h1>
        <p className="text-sm font-bold text-duo-muted">
          Overview of your platform metrics
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : stats.map((s) => <StatCard key={s.id} stat={s} />)}
      </div>

      <div className="duo-card p-5">
        <h3 className="text-lg font-extrabold text-duo-text mb-4">
          Recent Activity
        </h3>
        <ul className="flex flex-col gap-4">
          {[
            { id: 'a1', actor: 'Admin', action: 'Updated user role for jane@corp.com', timestamp: '2 min ago' },
            { id: 'a2', actor: 'System', action: 'Auto-suspended inactive account', timestamp: '1 hr ago' },
            { id: 'a3', actor: 'Editor', action: 'Published new article draft', timestamp: '3 hrs ago' },
          ].map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-duo-blue" />
              <div>
                <p className="text-sm font-bold text-duo-text">
                  <span className="text-duo-blue">{a.actor}</span> {a.action}
                </p>
                <p className="text-xs font-semibold text-duo-muted">{a.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
