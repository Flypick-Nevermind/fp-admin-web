/**
 * Skeleton loader for the Unassigned Carts card.
 * Mirrors the real card layout (status chip, name block, timestamps, button)
 * so the placeholder looks like the finished card — just empty.
 * Uses the `duo-skeleton` shimmer utility from index.css.
 */
export function UnassignedCartCardSkeleton() {
  return (
    <div className="duo-card p-5 flex flex-col gap-4" aria-hidden="true">
      {/* top row: short id + status chip */}
      <div className="flex items-center justify-between gap-2">
        <div className="duo-skeleton h-4 w-16" />
        <div className="duo-skeleton h-6 w-24 rounded-full" />
      </div>

      {/* name / email / phone */}
      <div className="flex flex-col gap-1.5">
        <div className="duo-skeleton h-5 w-40" />
        <div className="duo-skeleton h-3.5 w-52" />
        <div className="duo-skeleton h-3.5 w-28" />
      </div>

      {/* timestamps */}
      <div className="flex flex-col gap-1">
        <div className="duo-skeleton h-3 w-36" />
        <div className="duo-skeleton h-3 w-36" />
      </div>

      {/* assign button */}
      <div className="duo-skeleton h-10 w-full rounded-xl" />
    </div>
  );
}
