import { useRef, useState } from 'react';
import type { CartCreationDetailItem } from '@/core/entities/cartCreationDetail';
import { shopLabel } from '@/shared/utils/cart';
import { resolveImageSrc } from '@/shared/utils/image';

export interface CartItemUpdate {
  detailId: string;
  detailNotes: string;
  isReject: boolean;
  cartTitle: string;
  cartPrice: string;
  /**
   * S3 object keys for images added via upload (returned by the
   * /images/upload endpoint). Rendered through the media proxy, never
   * as a raw / signed / public URL.
   */
  addedImages: string[];
}

interface CartItemEditorProps {
  item: CartCreationDetailItem;
  /**
   * Persist the item edit. Returns a promise; shows a spinner while it
   * resolves. Placeholder until the backend endpoint is provided.
   */
  onSave: (payload: CartItemUpdate) => Promise<void>;
  /**
   * Upload an image file, returns the persisted S3 object key. The image
   * is displayed via `resolveImageSrc` → `GET /images/media/{key}`.
   */
  onUpload: (file: File) => Promise<string>;
}

/**
 * Editable card for a single item line: fill / change the item's fields,
 * toggle "reject", and upload additional product images.
 */
export function CartItemEditor({
  item,
  onSave,
  onUpload,
}: CartItemEditorProps) {
  const [notes, setNotes] = useState(item.detailNotes);
  const [title, setTitle] = useState(item.cart.cartTitle);
  const [price, setPrice] = useState(item.cart.cartPrice);
  const [isReject, setReject] = useState(item.isReject);
  const [addedImages, setAddedImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const existingImages = item.cart.cartImages;

  const notesEmpty = notes.trim().length === 0;
  const rejectNeedsNote = isReject && notesEmpty;

  const dirty =
    notes !== item.detailNotes ||
    title !== item.cart.cartTitle ||
    price !== item.cart.cartPrice ||
    isReject !== item.isReject ||
    addedImages.length > 0;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Placeholder: persist the upload via the (future) API. Until then,
      // show a local preview so the UI behaves like it's already wired.
      const url = await onUpload(file);
      setAddedImages((prev) => [...prev, url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  /**
   * Toggling reject clears the filled-in fields (title / price / uploaded
   * images) and locks them, so a rejected item can't carry product data.
   * The notes field stays editable — it becomes the required rejection reason.
   */
  function handleRejectChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    setReject(next);
    if (next) {
      setTitle('');
      setPrice('');
      setAddedImages([]);
    }
  }

  async function handleSave() {
    // Rejecting an item requires a note explaining why.
    if (rejectNeedsNote) {
      setError('A note is required when rejecting this item.');
      return;
    }
    setSuccess(false);
    setError(null);
    setSaving(true);
    try {
      await onSave({
        detailId: item.detailId,
        detailNotes: notes,
        isReject,
        cartTitle: title,
        cartPrice: price,
        addedImages,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {shopLabel(item.cart.cartUrl)}
        </span>
        {isReject ? (
          <span className="badge bg-danger-soft text-danger">Rejected</span>
        ) : (
          <span className="badge bg-success-soft text-success">Accepted</span>
        )}
      </div>

      {/* Images: existing (from the cart) + uploaded (state-only, removable) */}
      <div className="flex flex-wrap gap-2">
        {existingImages.map((src, i) => (
          <img
            key={`existing-${i}`}
            src={resolveImageSrc(src)}
            alt=""
            className="h-14 w-14 rounded-md object-cover bg-app-surface border border-border"
          />
        ))}
        {addedImages.map((objectKey) => (
          <div key={`added-${objectKey}`} className="relative">
            <img
              src={resolveImageSrc(objectKey)}
              alt=""
              className="h-14 w-14 rounded-md object-cover bg-app-surface border border-border"
            />
            <button
              type="button"
              onClick={() =>
                setAddedImages((prev) =>
                  prev.filter((k) => k !== objectKey),
                )
              }
              disabled={isReject}
              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-danger text-white text-xs leading-none flex items-center justify-center shadow-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Remove uploaded image"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
        {!isReject && (
          <label
            className={`h-14 w-14 rounded-md border border-dashed ${
              uploading ? 'border-accent text-accent' : 'border-border text-subtle'
            } flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:border-accent hover:text-accent transition-colors`}
          >
            {uploading ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
                <span className="text-[9px]">Uploading</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-[9px]">Upload</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
        {isReject && (
          <span className="text-xs font-medium text-subtle self-center">
            Upload locked
          </span>
        )}
      </div>

      {/* Product URL (read-only text) so the admin can check / copy it */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Product URL</span>
        <div className="flex items-center gap-2">
          <a
            href={item.cart.cartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 break-all rounded-md bg-app-surface border border-border px-3 py-2 text-xs font-mono text-info hover:border-accent transition-colors"
          >
            {item.cart.cartUrl}
          </a>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(item.cart.cartUrl)}
            className="btn-secondary shrink-0 !px-3 !py-2"
            aria-label="Copy URL"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      {/* Editable fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Product</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isReject ? 'Locked' : 'Product title'}
            disabled={isReject}
            className={`input ${isReject ? '!bg-app-surface !text-subtle !border-border cursor-not-allowed' : ''}`}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Price</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={isReject ? 'Locked' : '0.00'}
            disabled={isReject}
            className={`input ${isReject ? '!bg-app-surface !text-subtle !border-border cursor-not-allowed' : ''}`}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">
          Detail notes{' '}
          {isReject && (
            <span className="text-danger">· required when rejecting</span>
          )}
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder={
            isReject
              ? 'Required — explain why this item is being rejected…'
              : 'Internal note for this item…'
          }
          className={`input resize-y ${
            rejectNeedsNote ? '!border-danger' : ''
          }`}
        />
      </label>

      {/* Reject toggle */}
      <label
        className={`flex items-center gap-2.5 cursor-pointer select-none ${isReject ? '' : ''}`}
      >
        <input
          type="checkbox"
          checked={isReject}
          onChange={handleRejectChange}
          className="h-4 w-4 rounded accent-[#ff5c7a]"
        />
        <span className="text-xs font-medium text-text">
          Reject this item
        </span>
        {isReject && (
          <span className="text-xs font-medium text-danger">
            · fields locked, note required
          </span>
        )}
      </label>

      {/* Feedback */}
      {success && (
        <div className="text-xs font-medium text-success bg-success-soft border border-success/20 rounded-md px-3 py-2">
          Item saved.
        </div>
      )}
      {error && (
        <div className="text-xs font-medium text-danger bg-danger-soft border border-danger/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || rejectNeedsNote || (dirty === false && !success)}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          )}
          {saving ? 'Saving…' : 'Save item'}
        </button>
        {rejectNeedsNote ? (
          <span className="text-xs font-medium text-danger">
            Fill a note before saving a rejection.
          </span>
        ) : dirty ? null : (
          <span className="text-xs text-subtle">No changes</span>
        )}
      </div>
    </div>
  );
}
