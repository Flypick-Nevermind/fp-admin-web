import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Toast state for <ToastHost> (see ./Toast.tsx) — self-contained, no
 * context, no global wiring: call it once per host, render the returned
 * items, fire with `pushToast('success', 'Cart updated')`. Toasts
 * auto-dismiss after their duration; `dismissToast` closes one early.
 */

export type ToastKind = 'success' | 'error';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  durationMs: number;
}

export function useToasts(defaultDurationMs = 4200) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    (
      kind: ToastKind,
      title: string,
      description?: string,
      durationMs?: number,
    ) => {
      nextId.current += 1;
      const id = nextId.current;
      const ms = durationMs ?? defaultDurationMs;
      setToasts((prev) => [
        ...prev,
        { id, kind, title, description, durationMs: ms },
      ]);
      timers.current.set(id, window.setTimeout(() => dismissToast(id), ms));
      return id;
    },
    [dismissToast, defaultDurationMs],
  );

  // Clear pending auto-dismiss timers when the host unmounts.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, []);

  return { toasts, pushToast, dismissToast };
}
