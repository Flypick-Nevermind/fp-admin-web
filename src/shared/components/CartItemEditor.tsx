import { useRef, useState } from 'react';
import type { CartCreationDetailItem } from '@/core/entities/cartCreationDetail';
import { shopLabel } from '@/shared/utils/cart';
import { resolveImageSrc } from '@/shared/utils/image';

/**
 * Editable card for a single item line. Fully CONTROLLED: the page owns
 * the draft (via useItemDrafts) and persists it with the shared "Save
 * changes" button — this component has no save button of its own.
 *
 * Fields: product title / price, reject toggle, detail notes, and image
 * uploads (the upload returns the S3 object key, shown through the media
 * proxy; the page merges it into the payload's image set).
 */

export interface CartItemDraft {
  detailNotes: string;
  cartTitle: string;
  cartPrice: string;
  isReject: boolean;
  /** S3 object keys added via upload (not yet persisted). */
  addedImages: string[];
}

interface CartItemEditorProps {
  item: CartCreationDetailItem;
  /** The draft for this item, owned by the page. */
  draft: CartItemDraft;
  /** Patch the draft (the page re-renders this card with the new values). */
  onChange: (patch: Partial<CartItemDraft>) => void;
  /** Upload an image file, returns the persisted S3 object key. */
  onUpload: (file: File) => Promise<string>;
  /**
   * True while the shared save button is submitting — locks the
   * per-item fields so mid-save edits can't race the request.
   */
  saving?: boolean;
}

export function CartItemEditor({
  item,
  draft,
  onChange,
  onUpload,
  saving,
}: CartItemEditorProps) {
  const { detailNotes, cartTitle, cartPrice, isReject, addedImages } = draft;

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const existingImages = item.cart.cartImages;
  const notesEmpty = detailNotes.trim().length === 0;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const objectKey = await onUpload(file);
      onChange({ addedImages: [...addedImages, objectKey] });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  /**
   * Toggling reject clears the filled-in fields (title / price / uploaded
   * images) and locks them, so a rejected item can't carry product data.
   * The notes field stays editable — it becomes the required rejection
   * reason.
   */
  function handleRejectChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    if (next) {
      onChange({ isReject: true, cartTitle: '', cartPrice: '', addedImages: [] });
    } else {
      onChange({ isReject: false });
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

      {/* Images: existing (from the cart) + uploaded (draft, removable) */}
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
                onChange({
                  addedImages: addedImages.filter((k) => k !== objectKey),
                })
              }
              disabled={isReject || saving}
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
              disabled={uploading || saving}
            />
          </label>
        )}
        {isReject && (
          <span className="text-xs font-medium text-subtle self-center">
            Upload locked
          </span>
        )}
      </div>

      {uploadError && (
        <div className="text-xs font-medium text-danger bg-danger-soft border border-danger/20 rounded-md px-3 py-2">
          {uploadError}
        </div>
      )}

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
          </button>
        </div>
      </div>

      {/* Editable fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Product</span>
          <input
            value={cartTitle}
            onChange={(e) => onChange({ cartTitle: e.target.value })}
            placeholder={isReject ? 'Locked' : 'Product title'}
            disabled={isReject || saving}
            className={`input ${isReject ? '!bg-app-surface !text-subtle !border-border cursor-not-allowed' : ''}`}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Price</span>
          <input
            value={cartPrice}
            onChange={(e) => onChange({ cartPrice: e.target.value })}
            placeholder={isReject ? 'Locked' : '0.00'}
            disabled={isReject || saving}
            className={`input ${isReject ? '!bg-app-surface !text-subtle !border-border cursor-not-allowed' : ''}`}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">
          Detail notes{' '}
          <span className="text-danger">· required</span>
        </span>
        <textarea
          value={detailNotes}
          onChange={(e) => onChange({ detailNotes: e.target.value })}
          rows={2}
          placeholder={
            isReject
              ? 'Required — explain why this item is being rejected…'
              : 'Required — internal note for this item…'
          }
          disabled={saving}
          className={`input resize-y ${notesEmpty ? '!border-danger' : ''}`}
        />
      </label>

      {/* Reject toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isReject}
          onChange={handleRejectChange}
          disabled={saving}
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
    </div>
  );
}
