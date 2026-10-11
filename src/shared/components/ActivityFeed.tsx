import type { ActivityItem } from '@/core/entities/admin';

interface ActivityFeedProps {
  items: ActivityItem[];
}

/** Reusable presentation molecule — the admin activity feed. */
export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-extrabold text-text mb-4">
        Recent Activity
      </h3>
      <ul className="flex flex-col gap-4">
        {items.map((a) => (
          <li key={a.id} className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            <div className="flex flex-col">
              <p className="text-sm font-bold text-text leading-snug">
                <span className="text-accent">{a.actor}</span>{' '}
                <span className="text-text">{a.action}</span>
              </p>
              <p className="text-xs font-semibold text-muted">
                {a.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
