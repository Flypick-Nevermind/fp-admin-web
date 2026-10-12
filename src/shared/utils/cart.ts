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
    case 'ON_CHECK':
      return 'bg-warning-soft text-warning';
    case 'DONE':
      return 'bg-success-soft text-success';
    case 'CANCELED':
      return 'bg-danger-soft text-danger';
    default:
      return 'bg-card text-muted';
  }
}

/** Human label for a status id (falls back to the raw id). */
export function statusLabel(id: string): string {
  const map: Record<string, string> = {
    ON_PROGRESS: 'On progress',
    ON_CHECK: 'On check',
    DONE: 'Done',
    CANCELED: 'Canceled',
  };
  return map[id] ?? id;
}

/**
 * Extract a short shop label from a product URL (e.g. "taobao" / "tmall"),
 * or fall back to the hostname. Helps admins recognise where the item came
 * from without opening every link.
 */
export function shopLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host.includes('taobao')) return 'Taobao';
    if (host.includes('tmall')) return 'Tmall';
    return host;
  } catch {
    return url;
  }
}
