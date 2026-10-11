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

/** Map a cart-creation status id to a professional badge token. */
export function statusColor(id: string): string {
  switch (id) {
    case 'ON_PROGRESS':
      return 'bg-info-soft text-info';
    case 'COMPLETED':
      return 'bg-success-soft text-success';
    case 'CANCELLED':
      return 'bg-danger-soft text-danger';
    default:
      return 'bg-card text-muted';
  }
}
