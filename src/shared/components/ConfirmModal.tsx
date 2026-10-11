import { useEffect, type ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual style of the confirm button. Default: primary (accent). */
  confirmVariant?: 'primary' | 'danger';
  /** While true, disables the buttons and shows a spinner on confirm. */
  busy?: boolean;
  /** An error message to display inside the modal. */
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional extra content (e.g. a summary of what's being confirmed). */
  children?: ReactNode;
}

/**
 * Reusable confirmation modal — professional (dark card, clean buttons).
 * Closes on Escape or backdrop click. Generic enough to reuse for any
 * "ya / tidak" gate. Supports a busy (submitting) state and inline errors.
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Ya',
  cancelLabel = 'Tidak',
  confirmVariant = 'primary',
  busy = false,
  error = null,
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, busy]);

  if (!open) return null;

  const confirmClass =
    confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !busy && onCancel()}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm card p-6 flex flex-col shadow-2xl">
        <h2 id="confirm-title" className="text-base font-semibold text-text">
          {title}
        </h2>

        {description && (
          <div className="mt-2 text-sm text-muted">{description}</div>
        )}

        {children}

        {error && (
          <div className="mt-4 text-xs font-medium text-danger bg-danger-soft border border-danger/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`${confirmClass} flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {busy && (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {busy ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
