import { useInactiveUserCount } from '@/presentation/hooks/useInactiveUserCount';

/**
 * Live metric tile — number of inactive users, fetched from the backend.
 * Shows a skeleton while loading and an error state on failure.
 */
export function InactiveUsersCard() {
  const { count, loading, error } = useInactiveUserCount();

  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <span className="text-sm font-medium text-muted">Inactive Users</span>

      {loading && (
        <>
          <div className="skeleton h-9 w-16" />
          <div className="skeleton h-3 w-24" />
        </>
      )}

      {!loading && error && (
        <div>
          <span className="text-2xl font-semibold tracking-tight text-danger">
            —
          </span>
          <span className="text-xs text-subtle block mt-2">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold tracking-tight text-text">
            {count?.toLocaleString() ?? 0}
          </span>
          <span className="badge bg-warning-soft text-warning mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            live
          </span>
        </div>
      )}

      <span className="text-xs text-subtle">currently inactive</span>
    </div>
  );
}
