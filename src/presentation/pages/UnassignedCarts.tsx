import { useState } from 'react';
import { useUnassignedCartCreations } from '../hooks/useUnassignedCartCreations';
import { formatTimestamp, statusColor } from '@/shared/utils/cart';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { UnassignedCartCardSkeleton } from '@/shared/components/UnassignedCartCardSkeleton';
import type { UnassignedCartCreation } from '@/core/entities/cartCreation';

/**
 * Full-page view — unassigned cart creations (admin queue).
 * Duolingo-style list: friendly status chips, bold numbers, action button.
 *
 * "Assign" is gated behind a Setuju / Tidak Setuju confirmation modal so an
 * accidental click can't change the queue.
 */
export function UnassignedCartsPage() {
  const { items, loading, error, reload } = useUnassignedCartCreations();
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
          <h1 className="text-2xl font-extrabold text-duo-text">
            Unassigned Carts
          </h1>
          <p className="text-sm font-bold text-duo-muted">
            Cart creations waiting to be assigned
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
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <UnassignedCartCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="duo-card p-6 text-center">
          <p className="text-sm font-extrabold text-duo-red">{error}</p>
          <button onClick={reload} className="duo-btn-primary px-6 py-2.5 text-sm mt-4">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="duo-card p-10 text-center">
          <p className="text-4xl">🎉</p>
          <p className="text-lg font-extrabold text-duo-text mt-3">
            Nothing to assign
          </p>
          <p className="text-sm font-bold text-duo-muted">
            All cart creations have been handled.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((c) => (
            <article key={c.cartCreationId} className="duo-card p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-duo-muted">
                  {c.user.userId.slice(0, 8)}
                </span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full ${statusColor(c.statusId)}`}
                >
                  {c.statusId}
                </span>
              </div>

              <div className="flex flex-col">
                <p className="text-base font-extrabold text-duo-text">
                  {c.user.userName}
                </p>
                <p className="text-xs font-bold text-duo-muted">{c.user.userEmail}</p>
                <p className="text-xs font-bold text-duo-muted">{c.user.userPhone}</p>
              </div>

              {c.statusNotes ? (
                <p className="text-sm font-bold text-duo-text">
                  “{c.statusNotes}”
                </p>
              ) : null}

              <div className="text-xs font-bold text-duo-muted flex flex-col gap-0.5">
                <span>Created {formatTimestamp(c.createdAt)}</span>
                <span>Updated {formatTimestamp(c.updatedAt)}</span>
              </div>

              <button
                onClick={() => setPending(c)}
                className="duo-btn-primary px-5 py-2.5 text-sm"
              >
                Assign
              </button>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={pending !== null}
        title="Assign this cart?"
        confirmLabel="Setuju"
        cancelLabel="Tidak Setuju"
        onConfirm={onConfirmAssign}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <div className="mt-3 p-3 rounded-xl bg-duo-surface border-2 border-duo-border">
            <p className="text-sm font-extrabold text-duo-text">
              {pending.user.userName}
            </p>
            <p className="text-xs font-bold text-duo-muted">
              {pending.user.userEmail}
            </p>
            <p className="text-xs font-bold text-duo-muted mt-1">
              Cart: {pending.cartCreationId.slice(0, 8)} ·{' '}
              <span className="text-duo-blue-dark">{pending.statusId}</span>
            </p>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
