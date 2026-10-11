/**
 * Skeleton loader for an assigned-cart card.
 * Mirrors the real card layout (status chip, user block, timestamps) with
 * the `skeleton` shimmer utility.
 */
export function AssignedCartCardSkeleton() {
  return (
    <div className="card card-hover p-5 flex flex-col gap-4" aria-hidden="true">
      {/* top row: status chip */}
      <div className="flex items-center justify-between gap-2">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>

      {/* user block */}
      <div className="flex flex-col gap-1.5">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-3.5 w-52" />
        <div className="skeleton h-3.5 w-28" />
      </div>

      {/* timestamps */}
      <div className="flex flex-col gap-1">
        <div className="skeleton h-3 w-36" />
        <div className="skeleton h-3 w-36" />
      </div>
    </div>
  );
}
