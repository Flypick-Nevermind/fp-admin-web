import type { DashboardStat } from '@/core/entities/admin';

interface StatCardProps {
  stat: DashboardStat;
}

/**
 * Reusable presentation atom — a Duolingo-style stat tile.
 * Pure: receives data, no business logic.
 */
export function StatCard({ stat }: StatCardProps) {
  return (
    <div className="duo-card p-5 flex flex-col gap-2">
      <span className="text-sm font-bold text-duo-muted">{stat.title}</span>
      <span className="text-3xl font-extrabold text-duo-text">{stat.value}</span>
      <span
        className={`text-sm font-bold ${
          stat.deltaPositive ? 'text-duo-green' : 'text-duo-red'
        }`}
      >
        {stat.delta}
      </span>
    </div>
  );
}
