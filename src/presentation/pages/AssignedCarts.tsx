import { useAssignedCartCreations } from '../hooks/useAssignedCartCreations';
import { formatTimestamp, statusColor } from '@/shared/utils/cart';
import { AssignedCartCardSkeleton } from '@/shared/components/AssignedCartCardSkeleton';
import { Pagination } from '@/shared/components/Pagination';

/**
 * Full-page view — assigned cart creations (admin queue, paginated).
 * Shows the carts assigned to the logged-in admin, with a professional
 * card grid + pagination footer.
 */
export function AssignedCartsPage() {
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
  } = useAssignedCartCreations();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Assigned Carts</h1>
          <p className="text-sm text-muted mt-1">
            Cart creations assigned to you
          </p>
        </div>
        <button onClick={reload} className="btn-secondary">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3" />
          </svg>
          Refresh
        </button>
      </header>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <AssignedCartCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="card card-hover p-8 text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
          <button onClick={reload} className="btn-primary mt-4">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="card card-hover p-10 text-center">
          <p className="text-sm font-medium text-text">No assigned carts</p>
          <p className="text-sm text-muted mt-1">
            Nothing has been assigned to you yet.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((c) => (
              <article key={c.cartCreationId} className="card card-hover p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-subtle">
                    {c.user.userId.slice(0, 8)}
                  </span>
                  <span className={`badge ${statusColor(c.statusId)}`}>
                    {c.statusId}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-text">{c.user.userName}</p>
                  <p className="text-xs text-muted">{c.user.userEmail}</p>
                  <p className="text-xs text-muted">{c.user.userPhone}</p>
                </div>

                {c.statusNotes ? (
                  <p className="text-xs text-muted italic">“{c.statusNotes}”</p>
                ) : null}

                <div className="text-xs text-subtle flex flex-col gap-0.5">
                  <span>Created {formatTimestamp(c.createdAt)}</span>
                  <span>Updated {formatTimestamp(c.updatedAt)}</span>
                </div>
              </article>
            ))}
          </div>

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
        </>
      )}
    </div>
  );
}
