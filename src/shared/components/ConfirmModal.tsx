import { useEffect, type ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual style of the confirm button. Default: primary (green). */
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional extra content (e.g. a summary of what's being confirmed). */
  children?: ReactNode;
}

/**
 * Reusable confirmation modal — Duolingo-style (rounded card, thick buttons).
 * Closes on Escape or backdrop click. Generic enough to reuse for any
 * "setuju / tidak setuju" gate.
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Setuju',
  cancelLabel = 'Tidak Setuju',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass =
    confirmVariant === 'danger' ? 'duo-btn-danger' : 'duo-btn-primary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-duo-text/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm duo-card p-6 flex flex-col">
        <h2 id="confirm-title" className="text-xl font-black text-duo-text">
          {title}
        </h2>

        {description && (
          <div className="mt-2 text-sm font-bold text-duo-muted">
            {description}
          </div>
        )}

        {children}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="duo-btn-secondary flex-1 px-5 py-2.5 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${confirmClass} flex-1 px-5 py-2.5 text-sm`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
