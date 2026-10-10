/** Format ISO 8601 timestamps to a compact human-readable string. */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Map a cart-creation status id to a Duolingo-style color token. */
export function statusColor(id: string): string {
  switch (id) {
    case 'ON_PROGRESS':
      return 'bg-duo-blue text-white';
    case 'COMPLETED':
      return 'bg-duo-green/20 text-duo-green-dark';
    case 'CANCELLED':
      return 'bg-duo-red/15 text-duo-red';
    default:
      return 'bg-duo-surface text-duo-muted';
  }
}
