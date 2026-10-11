import type { DashboardStat } from '@/core/entities/admin';

interface StatCardProps {
  stat: DashboardStat;
}

/**
 * Reusable presentation atom — a professional metric tile.
 * Pure: receives data, no business logic.
 */
export function StatCard({ stat }: StatCardProps) {
  const up = stat.deltaPositive;
  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <span className="text-sm font-medium text-muted">{stat.title}</span>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-text">
          {stat.value}
        </span>
        <span
          className={`badge mb-1 ${
            up ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            {up ? (
              <path d="M8 4l4 5H4l4-5z" />
            ) : (
              <path d="M8 12L4 7h8l-4 5z" />
            )}
          </svg>
          {stat.delta}
        </span>
      </div>
      <span className="text-xs text-subtle">vs. previous period</span>
    </div>
  );
}
