/**
 * Skeleton loader for a dashboard stat card.
 * Mirrors the real StatCard layout (label, big number, delta) with the
 * `duo-skeleton` shimmer utility.
 */
export function StatCardSkeleton() {
  return (
    <div className="duo-card p-5 flex flex-col gap-3" aria-hidden="true">
      <div className="duo-skeleton h-4 w-24" />
      <div className="duo-skeleton h-9 w-32" />
      <div className="duo-skeleton h-4 w-14" />
    </div>
  );
}
