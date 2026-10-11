import { useState } from 'react';
import { useUnassignedCartCreations } from '../hooks/useUnassignedCartCreations';
import { formatTimestamp, statusColor } from '@/shared/utils/cart';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { UnassignedCartCardSkeleton } from '@/shared/components/UnassignedCartCardSkeleton';
import { Pagination } from '@/shared/components/Pagination';
import type { UnassignedCartCreation } from '@/core/entities/cartCreation';

/**
 * Full-page view — unassigned cart creations (admin queue, paginated).
 * Professional list + pagination footer.
 *
 * "Assign" is gated behind a confirmation modal so an accidental click
 * can't change the queue.
 */
export function UnassignedCartsPage() {
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
  } = useUnassignedCartCreations();
  const [pending, setPending] = useState<UnassignedCartCreation | null>(null);

  function onConfirmAssign() {
    if (!pending) return;
    // TODO: wire to the real assign endpoint (POST /cart-creations/:id/assign).
    console.log('[assign] confirm', pending.cartCreationId);
    setPending(null);
    reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Unassigned Carts</h1>
          <p className="text-sm text-muted mt-1">
            Cart creations waiting to be assigned
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
            <UnassignedCartCardSkeleton key={i} />
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
          <p className="text-sm font-medium text-text">Nothing to assign</p>
          <p className="text-sm text-muted mt-1">
            All cart creations have been handled.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
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
                <p className="text-sm font-semibold text-text">
                  {c.user.userName}
                </p>
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

              <button
                onClick={() => setPending(c)}
                className="btn-primary w-full"
              >
                Assign
              </button>
            </article>
          ))}
        </div>
      )}

      {meta && items.length > 0 && (
        <Pagination
          meta={meta}
          page={page}
          limit={limit}
          disabled={loading}
          onPageChange={goToPage}
          onLimitChange={setPageSize}
        />
      )}

      <ConfirmModal
        open={pending !== null}
        title="Assign this cart?"
        confirmLabel="Assign"
        cancelLabel="Cancel"
        onConfirm={onConfirmAssign}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <div className="mt-4 p-3 rounded-md bg-app-surface border border-border">
            <p className="text-sm font-semibold text-text">
              {pending.user.userName}
            </p>
            <p className="text-xs text-muted">{pending.user.userEmail}</p>
            <p className="text-xs text-muted mt-1.5">
              Cart {pending.cartCreationId.slice(0, 8)} ·{' '}
              <span className="text-info">{pending.statusId}</span>
            </p>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
