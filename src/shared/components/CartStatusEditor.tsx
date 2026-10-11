import { useState } from 'react';
import {
  CART_CREATION_STATUSES,
  type EditableCartStatus,
} from '@/core/entities/cartCreationDetail';
import { statusColor, statusLabel } from '@/shared/utils/cart';

interface CartStatusEditorProps {
  /** The cart creation id this editor belongs to. */
  cartCreationId: string;
  /** The current status + notes (used to initialise the draft). */
  statusId: string;
  statusNotes: string;
  /**
   * Persist the change. Returns a promise; the editor shows a spinner while
   * it resolves. When it resolves, the editor reports success.
   */
  onSave: (payload: {
    statusId: EditableCartStatus;
    statusNotes: string;
  }) => Promise<void>;
}

/**
 * Editable status + notes form, shown while a cart creation is
 * ON_PROGRESS. Lets an admin change the status and write notes.
 *
 * Self-contained draft state; calls `onSave` to persist. The parent is
 * responsible for reloading the data after a successful save.
 */
export function CartStatusEditor({
  cartCreationId,
  statusId,
  statusNotes,
  onSave,
}: CartStatusEditorProps) {
  const [draftStatus, setDraftStatus] =
    useState<EditableCartStatus>(statusId as EditableCartStatus);
  const [draftNotes, setDraftNotes] = useState(statusNotes);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = draftStatus !== statusId || draftNotes !== statusNotes;

  async function handleSave() {
    setSuccess(false);
    setError(null);
    setSaving(true);
    try {
      await onSave({ statusId: draftStatus, statusNotes: draftNotes });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }

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

      {/* Status picker */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Status</span>
        <div className="flex flex-wrap gap-2">
          {CART_CREATION_STATUSES.map((s) => {
            const active = draftStatus === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setDraftStatus(s)}
                className={`badge !px-3 !py-1.5 cursor-pointer transition-colors ${
                  active
                    ? statusColor(s) + ' ring-1 ring-current'
                    : 'bg-card text-muted hover:bg-app-surface'
                }`}
              >
                {statusLabel(s)}
              </button>
            );
          })}
        </div>
      </label>

      {/* Notes */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Notes</span>
        <textarea
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          rows={3}
          placeholder="Add an internal note about this cart…"
          className="input resize-y"
        />
      </label>

      {/* Feedback */}
      {success && (
        <div className="text-xs font-medium text-success bg-success-soft border border-success/20 rounded-md px-3 py-2">
          Status saved.
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
          disabled={saving || !dirty}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          )}
          {saving ? 'Saving…' : 'Save status'}
        </button>
        {!dirty && !success && (
          <span className="text-xs text-subtle">No changes</span>
        )}
      </div>
    </div>
  );
}
