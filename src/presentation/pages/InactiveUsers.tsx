import { useInactiveUsers } from '../hooks/useInactiveUsers';
import { formatTimestamp } from '@/shared/utils/cart';
import { userActiveState } from '@/shared/utils/userStatus';
import { InactiveUserRowSkeleton } from '@/shared/components/InactiveUserRowSkeleton';
import { Pagination } from '@/shared/components/Pagination';

/**
 * Full-page view — inactive / prospect users (admin list, paginated).
 * Professional table-style rows + pagination footer.
 */
export function InactiveUsersPage() {
  const {
    items,
    meta,
    page,
    limit,
    loading,
    error,
    goToPage,
    setPageSize,
    reload,
  } = useInactiveUsers();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Inactive Users</h1>
          <p className="text-sm text-muted mt-1">
            Prospect users who are currently inactive
          </p>
        </div>
        <button onClick={reload} className="btn-secondary">
          Refresh
        </button>
      </header>

      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <InactiveUserRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="card p-8 text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
          <button onClick={reload} className="btn-primary mt-4">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium text-text">No inactive users</p>
          <p className="text-sm text-muted mt-1">Everyone in this view is active.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr] gap-4 px-5 py-3 border-b border-border bg-app-surface/50">
            <span className="text-xs font-medium text-subtle">User</span>
            <span className="text-xs font-medium text-subtle">Status</span>
            <span className="text-xs font-medium text-subtle text-right">Last updated</span>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {items.map((u) => {
              const s = userActiveState(u.isActive);
              return (
                <article
                  key={u.userId}
                  className="grid grid-cols-[2fr_1fr_1.5fr] items-center gap-4 px-5 py-4 hover:bg-app-surface/40 transition-colors"
                >
                  {/* user */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 h-9 w-9 rounded-full bg-accent-soft text-accent flex items-center justify-center text-xs font-semibold">
                      {initials(u.userName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {u.userName}
                      </p>
                      <p className="text-xs text-muted truncate">{u.userEmail}</p>
                    </div>
                  </div>

                  {/* status */}
                  <div>
                    <span className={`badge ${s.cls}`}>{s.label}</span>
                  </div>

                  {/* updated */}
                  <div className="text-right text-xs text-subtle">
                    <p>{formatTimestamp(u.updatedAt)}</p>
                    <p className="mt-0.5">{u.userPhone || '—'}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {meta && (
            <div className="px-5 py-4 border-t border-border">
              <Pagination
                meta={meta}
                page={page}
                limit={limit}
                disabled={loading}
                onPageChange={goToPage}
                onLimitChange={setPageSize}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
