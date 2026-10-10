import { useInactiveUsers } from '../hooks/useInactiveUsers';
import { formatTimestamp } from '@/shared/utils/cart';
import { userActiveState } from '@/shared/utils/userStatus';
import { InactiveUserRowSkeleton } from '@/shared/components/InactiveUserRowSkeleton';
import { Pagination } from '@/shared/components/Pagination';

/**
 * Full-page view — inactive / prospect users (admin list, paginated).
 * Duolingo-style rows + a Duolingo-style pagination footer.
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
          <h1 className="text-2xl font-extrabold text-duo-text">
            Inactive Users
          </h1>
          <p className="text-sm font-bold text-duo-muted">
            Prospect users who are currently inactive
          </p>
        </div>
        <button
          onClick={reload}
          className="duo-btn-secondary px-5 py-2 text-sm"
        >
          ↻ Refresh
        </button>
      </header>

      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <InactiveUserRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="duo-card p-6 text-center">
          <p className="text-sm font-extrabold text-duo-red">{error}</p>
          <button
            onClick={reload}
            className="duo-btn-primary px-6 py-2.5 text-sm mt-4"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="duo-card p-10 text-center">
          <p className="text-4xl">👥</p>
          <p className="text-lg font-extrabold text-duo-text mt-3">
            No inactive users
          </p>
          <p className="text-sm font-bold text-duo-muted">
            Everyone in this view is active.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.map((u) => (
            <article key={u.userId} className="duo-card p-5 flex items-center gap-4">
              {/* avatar-like initials */}
              <div className="shrink-0 h-12 w-12 rounded-full bg-duo-green/20 text-duo-green-dark flex items-center justify-center text-lg font-black">
                {initials(u.userName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-extrabold text-duo-text truncate">
                    {u.userName}
                  </p>
                  {(() => {
                    const s = userActiveState(u.isActive);
                    return (
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${s.cls}`}
                      >
                        {s.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs font-bold text-duo-muted truncate">
                  {u.userEmail}
                </p>
                <p className="text-xs font-bold text-duo-muted">
                  {u.userPhone || '—'}
                </p>
              </div>

              <div className="shrink-0 text-right text-xs font-bold text-duo-muted">
                <p>Joined {formatTimestamp(u.createdAt)}</p>
                <p>Updated {formatTimestamp(u.updatedAt)}</p>
              </div>
            </article>
          ))}

          {meta && (
            <Pagination
              meta={meta}
              page={page}
              limit={limit}
              disabled={loading}
              onPageChange={goToPage}
              onLimitChange={setPageSize}
            />
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
