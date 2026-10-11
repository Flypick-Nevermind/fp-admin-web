import { useParams, Link } from 'react-router-dom';
import { useCartCreationDetail } from '../hooks/useCartCreationDetail';
import {
  formatTimestamp,
  statusColor,
  statusLabel,
  shopLabel,
} from '@/shared/utils/cart';
import { CartStatusEditor } from '@/shared/components/CartStatusEditor';
import {
  CartItemEditor,
  type CartItemUpdate,
} from '@/shared/components/CartItemEditor';

/**
 * Full-page view — a single cart creation and its item lines.
 * Fetched from `GET /cart-creations/{id}`.
 *
 * When the status is ON_PROGRESS, inline editors are shown:
 *  - CartStatusEditor  → change status + notes
 *  - CartItemEditor    → edit each item (URL, fields, reject, upload images)
 *
 * Save / upload actions are placeholders (no backend endpoints yet) —
 * the UI is fully functional and ready to wire up.
 */
export function CartCreationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { detail, loading, error } = useCartCreationDetail(id ?? null);

  const editable = detail?.statusId === 'ON_PROGRESS';

  /** Placeholder save — swap for the real status-update endpoint later. */
  async function handleSaveStatus(_payload: {
    statusId: string;
    statusNotes: string;
  }) {
    // TODO: await useUpdateCartCreationStatus().update(detail.cartCreationId, payload);
    // await reloadDetail();
  }

  /** Placeholder item update — swap for the real item-update endpoint later. */
  async function handleSaveItem(_item: CartItemUpdate) {
    // TODO: await useUpdateCartLineItem().update(detail.cartCreationId, _item);
    // await reloadDetail();
  }

  /** Placeholder image upload — swap for the real upload API later.
   *  Until then it echoes a local object URL so the preview works. */
  async function handleUploadImage(file: File): Promise<string> {
    // TODO: return useUploadImage().upload(file);
    return URL.createObjectURL(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/admin"
            className="btn-ghost shrink-0 -ml-2"
            aria-label="Back to dashboard"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-text">Cart Creation</h1>
            <p className="text-xs text-subtle font-mono truncate">{id}</p>
          </div>
        </div>
        {detail && (
          <span className={`badge shrink-0 ${statusColor(detail.statusId)}`}>
            {statusLabel(detail.statusId)}
          </span>
        )}
      </header>

      {loading && (
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-3 w-64 mt-3" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card card-hover p-5">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3 mt-3" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="card card-hover p-8 text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && detail && (
        <>
          {/* User summary */}
          <div className="card card-hover p-5 flex flex-col gap-2">
            <span className="text-xs font-medium text-muted">Customer</span>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-accent-soft text-accent flex items-center justify-center text-xs font-semibold">
                {initials(detail.user.userName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text truncate">
                  {detail.user.userName}
                </p>
                <p className="text-xs text-muted truncate">{detail.user.userEmail}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle mt-1">
              <span>Phone {detail.user.userPhone || '—'}</span>
              <span>Created {formatTimestamp(detail.createdAt)}</span>
              <span>Updated {formatTimestamp(detail.updatedAt)}</span>
            </div>
            {detail.statusNotes ? (
              <p className="text-xs text-muted italic mt-2">
                “{detail.statusNotes}”
              </p>
            ) : null}
          </div>

          {/* Editable status + notes (only while ON_PROGRESS) */}
          {detail.statusId === 'ON_PROGRESS' && (
            <CartStatusEditor
              cartCreationId={detail.cartCreationId}
              statusId={detail.statusId}
              statusNotes={detail.statusNotes}
              onSave={handleSaveStatus}
            />
          )}

          {/* Item lines */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">
                Items ({detail.details.length})
              </h2>
              {editable && (
                <span className="text-xs text-subtle">
                  Edit mode · changes save per item
                </span>
              )}
            </div>

            {detail.details.length === 0 && !editable && (
              <div className="card card-hover p-8 text-center">
                <p className="text-sm font-medium text-text">No items</p>
                <p className="text-sm text-muted mt-1">
                  This cart creation has no line items.
                </p>
              </div>
            )}

            {editable ? (
              /* Editable mode: each item becomes a CartItemEditor */
              <div className="flex flex-col gap-4">
                {detail.details.map((item) => (
                  <CartItemEditor
                    key={item.detailId}
                    item={item}
                    onSave={handleSaveItem}
                    onUpload={handleUploadImage}
                  />
                ))}
              </div>
            ) : (
              /* Read-only mode: static item cards */
              detail.details.map((item) => (
                <div key={item.detailId} className="card card-hover p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {shopLabel(item.cart.cartUrl)}
                    </span>
                    {item.isReject && (
                      <span className="badge bg-danger-soft text-danger">Rejected</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {item.cart.cartImages.length > 0 ? (
                      <img
                        src={item.cart.cartImages[0]}
                        alt=""
                        className="h-14 w-14 rounded-md object-cover bg-app-surface border border-border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-md bg-app-surface border border-border flex items-center justify-center text-subtle">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {item.cart.cartTitle || 'Untitled product'}
                      </p>
                      {item.cart.cartPrice ? (
                        <p className="text-xs text-success font-semibold mt-0.5">
                          {item.cart.cartPrice}
                        </p>
                      ) : null}
                      <a
                        href={item.cart.cartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent font-medium hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Open item
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M17 7H9M17 7v8" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {item.detailNotes ? (
                    <p className="text-xs text-muted italic">“{item.detailNotes}”</p>
                  ) : null}

                  <div className="text-[11px] text-subtle">
                    Added {formatTimestamp(item.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
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
