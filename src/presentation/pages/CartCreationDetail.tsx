import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartCreationDetail } from '../hooks/useCartCreationDetail';
import { useImageUpload } from '../hooks/useImageUpload';
import { useUpdateCartCreation } from '../hooks/useUpdateCartCreation';
import {
  useItemDrafts,
  type ItemDraft,
} from '../hooks/useItemDrafts';
import type {
  EditableCartStatus,
} from '@/core/entities/cartCreationDetail';
import {
  type UpdateCartCreationCommand,
  type UpdateCartCreationDetailCommand,
} from '@/core/entities/cartCreationUpdate';
import {
  formatTimestamp,
  statusColor,
  statusLabel,
  shopLabel,
} from '@/shared/utils/cart';
import { resolveImageSrc } from '@/shared/utils/image';
import {
  CartStatusEditor,
  type StatusDraft,
} from '@/shared/components/CartStatusEditor';
import { CartItemEditor } from '@/shared/components/CartItemEditor';
import { ToastHost } from '@/shared/components/Toast';
import { useToasts } from '@/shared/components/useToasts';

/**
 * Full-page view — a single cart creation and its item lines.
 * Fetched from `GET /cart-creations/{id}`.
 *
 * When the status is ON_CHECK, inline editors are shown:
 *  - CartStatusEditor  → change status + notes
 *  - CartItemEditor    → edit each item (URL, fields, reject, upload images)
 *
 * Image uploads go through the backend `/images/upload` endpoint and are
 * stored as S3 object keys, then rendered via the `/images/media` proxy
 * (Wasabi blocks direct public object access).
 */
export function CartCreationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { detail, loading, error, reload } = useCartCreationDetail(id ?? null);
  const { upload: uploadImage } = useImageUpload();
  const { update, submitting } = useUpdateCartCreation();
  const { toasts, pushToast, dismissToast } = useToasts();

  const editable = detail?.statusId === 'ON_CHECK';

  /*
   * Draft state (owned by the page; editors are fully controlled). Drafts
   * re-seed from the server data every time the detail is (re-)fetched,
   * so after a successful save the editors start from the persisted truth.
   */
  const [statusDraft, setStatusDraft] = useState<StatusDraft | null>(null);
  useEffect(() => {
    if (detail && editable) {
      setStatusDraft({
        statusId: detail.statusId as EditableCartStatus,
        statusNotes: detail.statusNotes,
      });
    }
  }, [detail, editable]);

  const { drafts, update: updateDraft } = useItemDrafts({
    seedKey: detail?.updatedAt ?? null,
    seed:
      detail?.details.map((item): ItemDraft => ({
        detailNotes: item.detailNotes,
        cartTitle: item.cart.cartTitle,
        cartPrice: item.cart.cartPrice,
        isReject: item.isReject,
        addedImages: [],
      })) ?? [],
  });

  /*
   * Build the sparse update payload from the drafts:
   *  - status fields only when the admin actually changed them;
   *  - one entry per CHANGED item line:
   *    - rejected lines send notes + flag only (no cart payload);
   *    - accepted lines send the full cart payload the backend requires
   *      (title, notes, complete image set, non-zero price).
   */
  const { detailCommands, statusChanged, hasChanges, firstIssue } = useMemo(
    () => {
      const commands: UpdateCartCreationDetailCommand[] = [];
      let issue: string | null = null;

      const statusChangedNow =
        statusDraft !== null &&
        detail !== null &&
        (statusDraft.statusId !== (detail.statusId as EditableCartStatus) ||
          statusDraft.statusNotes !== detail.statusNotes);

      detail?.details.forEach((item, i) => {
        const d = drafts[i];
        if (!d) return;
        const changed =
          d.detailNotes !== item.detailNotes ||
          d.cartTitle !== item.cart.cartTitle ||
          d.cartPrice !== item.cart.cartPrice ||
          d.isReject !== item.isReject ||
          d.addedImages.length > 0;
        if (!changed) return;

        const label = shopLabel(item.cart.cartUrl);
        const rejectChanged = d.isReject !== item.isReject;
        const images = [...item.cart.cartImages, ...d.addedImages];
        const price = toPriceNumber(d.cartPrice);

        if (d.isReject) {
          // Rejected: notes + flag only. The backend skips the
          // accepted-item rules and leaves the cart row / images alone.
          if (issue === null && d.detailNotes.trim() === '') {
            issue = `A note is required for the rejected item (${label}).`;
            return;
          }
          commands.push({
            detailId: item.detailId,
            cartId: item.cartId,
            detailNotes: d.detailNotes,
            isReject: rejectChanged ? true : null,
            cart: null,
          });
          return;
        }

        // Accepted: the backend requires a full, valid cart payload.
        if (issue === null && d.cartTitle.trim() === '') {
          issue = `Product title is required for ${label}.`;
          return;
        }
        if (issue === null && d.detailNotes.trim() === '') {
          issue = `Detail notes are required for ${label}.`;
          return;
        }
        if (issue === null && images.length === 0) {
          issue = `At least one product image is required for ${label}.`;
          return;
        }
        if (issue === null && price === 0) {
          issue = `Product price must not be zero for ${label}.`;
          return;
        }
        commands.push({
          detailId: item.detailId,
          cartId: item.cartId,
          detailNotes: d.detailNotes,
          isReject: rejectChanged ? false : null,
          cart: {
            cartTitle: d.cartTitle,
            cartPrice: price,
            // Complete set (existing + new): the backend replaces images.
            images,
          },
        });
      });

      return {
        detailCommands: commands,
        statusChanged: statusChangedNow,
        hasChanges: statusChangedNow || commands.length > 0,
        firstIssue: issue,
      };
    },
    [detail, drafts, statusDraft],
  );

  /**
   * One atomic save — status (when changed) + every changed item line in a
   * single POST /cart-creations/update. Success → toast drop from the top.
   */
  async function handleSaveAll() {
    if (!detail || !statusDraft || !hasChanges) return;

    if (firstIssue) {
      pushToast('error', "Can't save yet", firstIssue);
      return;
    }

    const command: Omit<UpdateCartCreationCommand, 'userAdminId'> = {
      cartCreationId: detail.cartCreationId,
      details: detailCommands,
    };
    if (statusChanged) {
      command.statusId = statusDraft.statusId;
      command.statusNotes = statusDraft.statusNotes;
    }

    try {
      const result = await update(command);
      pushToast(
        'success',
        'Cart creation saved',
        `${detail.cartCreationId.slice(0, 8)} · ${statusLabel(statusChanged ? result.statusId : detail.statusId)} · ${detailCommands.length} item${detailCommands.length === 1 ? '' : 's'} updated`,
      );
    } catch (e) {
      pushToast(
        'error',
        'Save failed',
        e instanceof Error ? e.message : 'Could not save the cart creation.',
      );
      return;
    }
    // Refetch → updated_at changes → all drafts re-seed automatically.
    await reload();
  }

  const pendingCount = detailCommands.length + (statusChanged ? 1 : 0);

  /** Real image upload → returns the S3 object key (displayed via the media proxy). */
  async function handleUploadImage(file: File): Promise<string> {
    return uploadImage(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastHost toasts={toasts} onDismiss={dismissToast} />
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
        <div className="flex items-center gap-3 shrink-0">
          {detail && (
            <span className={`badge ${statusColor(detail.statusId)}`}>
              {statusLabel(detail.statusId)}
            </span>
          )}
          {editable && statusDraft && (
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={!hasChanges || submitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          )}
        </div>
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

          {/* Editable status + notes (only while ON_CHECK) */}
          {detail.statusId === 'ON_CHECK' && statusDraft && (
            <CartStatusEditor
              cartCreationId={detail.cartCreationId}
              statusId={detail.statusId as EditableCartStatus}
              draft={statusDraft}
              onDraftChange={(patch) =>
                setStatusDraft((p) => (p ? { ...p, ...patch } : p))
              }
              saving={submitting}
            />
          )}

          {/* Item lines */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">
                Items ({detail.details.length})
              </h2>
              {editable &&
                (hasChanges ? (
                  <span className="text-xs font-medium text-warning">
                    {pendingCount} pending change{pendingCount === 1 ? '' : 's'}
                  </span>
                ) : (
                  <span className="text-xs text-subtle">
                    Edit mode · save all with the button above
                  </span>
                ))}
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
              /* Editable mode: each item becomes a controlled CartItemEditor.
               * All drafts persist together via the "Save changes" button
               * in the page header. */
              <div className="flex flex-col gap-4">
                {detail.details.map((item, i) =>
                  drafts[i] ? (
                    <CartItemEditor
                      key={item.detailId}
                      item={item}
                      draft={drafts[i]}
                      onChange={(patch) => updateDraft(i, patch)}
                      onUpload={handleUploadImage}
                      saving={submitting}
                    />
                  ) : null,
                )}
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
                        src={resolveImageSrc(item.cart.cartImages[0])}
                        alt=""
                        className="h-14 w-14 rounded-md object-cover bg-app-surface border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="%23666"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="10">No Image</text></svg>';
                        }}
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

/**
 * Parse the editor's price text input into the numeric value the update API
 * expects (float, stored as varchar in the DB). Empty / non-numeric → 0.
 */
function toPriceNumber(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}
