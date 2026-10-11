/**
 * Skeleton loader for an Inactive Users table row.
 * Mirrors the real row layout with the `skeleton` shimmer utility.
 */
export function InactiveUserRowSkeleton() {
  return (
    <div
      className="card px-5 py-4 flex flex-col gap-2"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="skeleton h-3.5 w-56" />
      <div className="skeleton h-3.5 w-40" />
    </div>
  );
}
