import { useState } from 'react';
import type { ExchangeRate, UpdateExchangeRateCommand } from '@/core/entities/exchangeRate';
import { useExchangeRate } from '@/presentation/hooks/useExchangeRate';
import { formatTimestamp } from '@/shared/utils/cart';
import { ToastHost } from '@/shared/components/Toast';
import { useToasts } from '@/shared/components/useToasts';

function formatIdr(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Settings sub-page: Exchange Rate (CNY -> IDR).
 * Reads current active rate via GET /api-admin/v1/settings/exchange-rate
 * and updates it via PUT /api-admin/v1/settings/exchange-rate.
 */
export function ExchangeRateSettingsPage() {
  const { exchangeRate, loading, error, saving, reload, update } =
    useExchangeRate();
  const { toasts, pushToast, dismissToast } = useToasts();

  return (
    <div className="flex flex-col gap-5">
      <ToastHost toasts={toasts} onDismiss={dismissToast} />

      {loading && (
        <div className="card p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-5 w-44 rounded bg-white/10" />
          <div className="h-10 w-full rounded bg-white/5" />
          <div className="h-20 w-full rounded bg-white/5" />
        </div>
      )}

      {!loading && error && (
        <div className="card p-6 flex flex-col gap-3 border-danger/30">
          <div className="text-sm font-semibold text-danger">
            Failed to load exchange rate
          </div>
          <p className="text-xs text-muted">{error}</p>
          <div>
            <button type="button" onClick={reload} className="btn-secondary">
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && exchangeRate && (
        <ExchangeRateForm
          key={`${exchangeRate.cnyToIdr}-${exchangeRate.updatedAt}-${exchangeRate.notes ?? ''}`}
          exchangeRate={exchangeRate}
          saving={saving}
          onSave={async (command) => {
            try {
              const updated = await update(command);
              pushToast(
                'success',
                'Exchange rate updated',
                `1 CNY = Rp ${formatIdr(updated.cnyToIdr)}`,
              );
            } catch (err) {
              pushToast(
                'error',
                'Failed to update exchange rate',
                err instanceof Error ? err.message : 'Unexpected error',
              );
            }
          }}
        />
      )}
    </div>
  );
}

interface ExchangeRateFormProps {
  exchangeRate: ExchangeRate;
  saving: boolean;
  onSave: (command: UpdateExchangeRateCommand) => Promise<void>;
}

function ExchangeRateForm({
  exchangeRate,
  saving,
  onSave,
}: ExchangeRateFormProps) {
  const [rateInput, setRateInput] = useState(() =>
    String(exchangeRate.cnyToIdr),
  );
  const [notesInput, setNotesInput] = useState(
    () => exchangeRate.notes ?? '',
  );

  const parsedRate = Number(rateInput);
  const isRateValid =
    rateInput.trim() !== '' && Number.isFinite(parsedRate) && parsedRate > 0;
  const trimmedNotes = notesInput.trim();
  const notesTooLong = notesInput.length > 500;

  const hasChanges =
    parsedRate !== exchangeRate.cnyToIdr ||
    trimmedNotes !== (exchangeRate.notes ?? '');

  const canSubmit = isRateValid && !notesTooLong && hasChanges && !saving;

  function handleReset() {
    setRateInput(String(exchangeRate.cnyToIdr));
    setNotesInput(exchangeRate.notes ?? '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    await onSave({
      cnyToIdr: parsedRate,
      notes: trimmedNotes ? trimmedNotes : undefined,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Current active rate summary */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-subtle">
            Active CNY to IDR Rate
          </span>
          <div className="text-2xl font-semibold text-text mt-1 tabular-nums">
            1 CNY = Rp {formatIdr(exchangeRate.cnyToIdr)}
          </div>
          {exchangeRate.notes && (
            <p className="text-xs text-muted mt-1">{exchangeRate.notes}</p>
          )}
        </div>
        <div className="flex flex-col sm:items-end gap-1 text-xs text-muted">
          <span>Updated {formatTimestamp(exchangeRate.updatedAt)}</span>
          <span>
            By <span className="text-text font-medium">{exchangeRate.updatedBy}</span>
          </span>
        </div>
      </div>

      {/* Update form */}
      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-text">
            Update Exchange Rate
          </h2>
          <p className="text-xs text-muted mt-1">
            Changes take effect immediately for CNY to IDR calculations.
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">
            Rate (1 CNY in IDR) <span className="text-danger">· required</span>
          </span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-subtle">
              Rp
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              disabled={saving}
              placeholder="2800"
              className={`input !pl-9 tabular-nums ${
                !isRateValid ? '!border-danger' : ''
              }`}
            />
          </div>
          {!isRateValid ? (
            <span className="text-xs text-danger">
              Enter a valid exchange rate greater than 0.
            </span>
          ) : (
            <span className="text-xs text-subtle">
              Preview: ¥100 = Rp {formatIdr(parsedRate * 100)}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">
              Notes (optional)
            </span>
            <span
              className={`text-[11px] ${
                notesTooLong ? 'text-danger' : 'text-subtle'
              }`}
            >
              {notesInput.length}/500
            </span>
          </div>
          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={3}
            disabled={saving}
            placeholder="e.g. Penyesuaian kurs harian"
            className={`input resize-y ${notesTooLong ? '!border-danger' : ''}`}
          />
          {notesTooLong && (
            <span className="text-xs text-danger">
              Notes must be at most 500 characters.
            </span>
          )}
        </label>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="btn-secondary"
          >
            Reset
          </button>
          <button type="submit" disabled={!canSubmit} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
