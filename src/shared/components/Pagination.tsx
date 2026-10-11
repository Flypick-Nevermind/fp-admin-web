import type { PageMeta } from '@/core/entities/page';

interface PaginationProps {
  meta: PageMeta;
  page: number;
  limit: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const LIMIT_OPTIONS = [10, 20, 50];

/**
 * Reusable professional pagination controls.
 * Prev / next + a "Page X of Y · N total" indicator + a page-size picker.
 */
export function Pagination({
  meta,
  page,
  limit,
  disabled,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { total_pages, total } = meta;
  const canPrev = page > 1;
  const canNext = page < total_pages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span>
          Page {meta.page} of {total_pages} · {total} total
        </span>

        {onLimitChange && (
          <label className="flex items-center gap-2">
            <span className="text-xs text-subtle">Rows</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              disabled={disabled}
              className="px-2 py-1 rounded-md border border-border bg-card text-xs font-medium text-text focus:outline-none focus:border-accent disabled:opacity-50"
            >
              {LIMIT_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev || disabled}
          className="btn-secondary text-sm"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext || disabled}
          className="btn-primary text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
