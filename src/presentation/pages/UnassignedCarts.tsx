import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnassignedCartCreations } from '../hooks/useUnassignedCartCreations';
import { useAssignCartCreation } from '../hooks/useAssignCartCreation';
import { formatTimestamp, statusColor, statusLabel } from '@/shared/utils/cart';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { UnassignedCartCardSkeleton } from '@/shared/components/UnassignedCartCardSkeleton';
import { Pagination } from '@/shared/components/Pagination';
import type { UnassignedCartCreation } from '@/core/entities/cartCreation';

/**
 * Full-page view — unassigned cart creations (admin queue, paginated).
 * Professional list + pagination footer.
 *
 * "Assign" is gated behind a confirmation modal (ya / tidak). On "ya" it
 * POSTs to /cart-creations/assign (admin = logged-in admin), then redirects
 * to the cart detail page on success.
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
  const { assign, submitting, error: assignError, clearError } =
    useAssignCartCreation();
  const [pending, setPending] = useState<UnassignedCartCreation | null>(null);
  const navigate = useNavigate();

  async function onConfirmAssign() {
    if (!pending) return;
    const cid = pending.cartCreationId;
    const result = await assign(cid);
    if (result) {
      // Success: leave the list and jump into the (now assigned) cart detail.
      navigate(`/admin/carts/${result.cartCreationId}`);
      return;
    }
    // Failed: keep the user on the list, show the error inside the modal.
  }

  function onCancelAssign() {
    clearError();
    setPending(null);
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
                  {statusLabel(c.statusId)}
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
        description="The cart will be assigned to your admin account."
        confirmLabel="Ya"
        cancelLabel="Tidak"
        busy={submitting}
        error={assignError}
        onConfirm={onConfirmAssign}
        onCancel={onCancelAssign}
      >
        {pending && (
          <div className="mt-4 p-3 rounded-md bg-app-surface border border-border">
            <p className="text-sm font-semibold text-text">
              {pending.user.userName}
            </p>
            <p className="text-xs text-muted">{pending.user.userEmail}</p>
            <p className="text-xs text-muted mt-1.5">
              Cart {pending.cartCreationId.slice(0, 8)} ·{' '}
              <span className="text-info">{statusLabel(pending.statusId)}</span>
            </p>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
