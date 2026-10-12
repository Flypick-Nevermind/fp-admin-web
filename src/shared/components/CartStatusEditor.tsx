import {
  CART_CREATION_STATUSES,
  SYSTEM_ONLY_STATUSES,
  type EditableCartStatus,
} from '@/core/entities/cartCreationDetail';
import { statusColor, statusLabel } from '@/shared/utils/cart';

export interface StatusDraft {
  statusId: EditableCartStatus;
  statusNotes: string;
}

interface CartStatusEditorProps {
  /** The cart creation id this editor belongs to. */
  cartCreationId: string;
  /** The current (persisted) status — shown as context in the subtitle. */
  statusId: EditableCartStatus;
  /** The draft owned by the page; this editor is fully controlled. */
  draft: StatusDraft;
  onDraftChange: (patch: Partial<StatusDraft>) => void;
  /** Lock the fields while the shared save button is submitting. */
  saving?: boolean;
}

/**
 * Editable status + notes form, shown while a cart creation is
 * ON_CHECK. The draft state lives in the page so the single
 * "Save changes" button (in the page header) persists status AND items
 * in one atomic call — this editor has no save button of its own.
 */
export function CartStatusEditor({
  cartCreationId,
  statusId,
  draft,
  onDraftChange,
  saving,
}: CartStatusEditorProps) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-text">Update status</h2>
        <p className="text-xs text-muted mt-0.5">
          Cart {cartCreationId.slice(0, 8)} · currently{' '}
          <span className="font-medium text-info">
            {statusLabel(statusId)}
          </span>
        </p>
      </div>

      {/* Status picker — system-only statuses are visible but disabled */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Status</span>
        <div className="flex flex-wrap gap-2">
          {CART_CREATION_STATUSES.map((s) => {
            const active = draft.statusId === s;
            const systemOnly = SYSTEM_ONLY_STATUSES.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onDraftChange({ statusId: s })}
                disabled={saving || systemOnly}
                title={
                  systemOnly
                    ? 'Set by the system only — cannot be selected'
                    : undefined
                }
                className={`badge !px-3 !py-1.5 transition-colors ${
                  active
                    ? statusColor(s) + ' ring-1 ring-current'
                    : systemOnly
                      ? 'bg-card text-subtle opacity-50 cursor-not-allowed'
                      : 'bg-card text-muted hover:bg-app-surface cursor-pointer'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {systemOnly && (
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                    </svg>
                  )}
                  {statusLabel(s)}
                </span>
              </button>
            );
          })}
        </div>
        {SYSTEM_ONLY_STATUSES.length > 0 && (
          <span className="text-[11px] text-subtle">
            {SYSTEM_ONLY_STATUSES.map((s) => statusLabel(s))
              .join(', ')}{' '}
            — set by the system only, not selectable.
          </span>
        )}
      </label>

      {/* Notes */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Notes</span>
        <textarea
          value={draft.statusNotes}
          onChange={(e) => onDraftChange({ statusNotes: e.target.value })}
          rows={3}
          placeholder="Add an internal note about this cart…"
          disabled={saving}
          className="input resize-y"
        />
      </label>
    </div>
  );
}
