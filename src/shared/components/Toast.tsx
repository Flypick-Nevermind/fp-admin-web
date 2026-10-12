import type { ToastItem } from './useToasts';

/**
 * Renders the toast stack fixed at the top-center of the viewport.
 * Pair with `useToasts` (./useToasts.ts) — entries animate in (drop +
 * subtle scale); a progress bar under each toast mirrors its
 * auto-dismiss timer.
 */

interface ToastHostProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastHost({ toasts, onDismiss }: ToastHostProps) {
  return (
    <div
      className="pointer-events-none fixed top-4 left-1/2 z-50 flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter pointer-events-auto relative overflow-hidden rounded-xl border border-border bg-app-surface/95 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md"
          role={toast.kind === 'error' ? 'alert' : 'status'}
        >
          <div className="flex items-start gap-3 px-4 py-3.5">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                toast.kind === 'success'
                  ? 'bg-success-soft text-success'
                  : 'bg-danger-soft text-danger'
              }`}
            >
              {toast.kind === 'success' ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              )}
            </span>

            <div className="min-w-0 flex-1 pr-4">
              <p className="text-sm font-semibold text-text">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-muted">{toast.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="mt-0.5 shrink-0 text-subtle transition-colors hover:text-text"
              aria-label="Dismiss notification"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="h-0.5 w-full bg-border/50">
            <div
              className={`toast-progress h-full ${
                toast.kind === 'success' ? 'bg-success' : 'bg-danger'
              }`}
              style={{ animationDuration: `${toast.durationMs}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
