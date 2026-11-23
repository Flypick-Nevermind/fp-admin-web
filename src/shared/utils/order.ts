import type { OrderStatus, PaymentStatus } from '@/core/entities/order';

export function orderStatusBadgeClass(status: OrderStatus | string): string {
  switch (status) {
    case 'WAITING_PAYMENT':
      return 'bg-warning-soft text-warning border-warning/20';
    case 'PROCESSING':
      return 'bg-info-soft text-info border-info/20';
    case 'SHIPPED':
      return 'bg-accent/15 text-accent border-accent/25';
    case 'COMPLETED':
      return 'bg-success-soft text-success border-success/20';
    case 'CANCELLED':
      return 'bg-danger-soft text-danger border-danger/20';
    default:
      return 'bg-card text-muted border-border';
  }
}

export function orderStatusLabel(status: OrderStatus | string): string {
  const map: Record<string, string> = {
    WAITING_PAYMENT: 'Menunggu Pembayaran',
    PROCESSING: 'Diproses',
    SHIPPED: 'Dalam Pengiriman',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return map[status] ?? status;
}

export function paymentStatusBadgeClass(status: PaymentStatus | string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-warning-soft text-warning border-warning/20';
    case 'SETTLEMENT':
      return 'bg-success-soft text-success border-success/20';
    case 'EXPIRED':
      return 'bg-card text-muted border-border';
    case 'FAILED':
      return 'bg-danger-soft text-danger border-danger/20';
    default:
      return 'bg-card text-muted border-border';
  }
}

export function paymentStatusLabel(status: PaymentStatus | string): string {
  const map: Record<string, string> = {
    PENDING: 'Menunggu Verifikasi',
    SETTLEMENT: 'Lunas (Settlement)',
    EXPIRED: 'Kedaluwarsa',
    FAILED: 'Gagal',
  };
  return map[status] ?? status;
}

export type PackagingOption = 'WITH_BOX' | 'NO_BOX';

export interface ParsedItemNotes {
  packaging: PackagingOption | null;
  remainingNotes: string;
}

/**
 * Extract `WITH_BOX` / `NO_BOX` packaging option embedded in `item.notes`
 * (e.g. "Opsi Kemasan: NO_BOX (Lepas kardus) • Terverifikasi...") so the UI
 * can render it as a dedicated badge without duplicating it in notes.
 */
export function parseOrderItemNotes(notes: string): ParsedItemNotes {
  if (!notes) return { packaging: null, remainingNotes: '' };

  const segmentRegex =
    /(?:Opsi\s+Kemasan\s*:\s*)?(WITH_BOX|NO_BOX)(?:\s*\([^)]*\))?/i;
  const match = notes.match(segmentRegex);
  if (!match) {
    return { packaging: null, remainingNotes: notes.trim() };
  }

  const packaging = match[1].toUpperCase() as PackagingOption;
  const remainingNotes = notes
    .replace(segmentRegex, '')
    .replace(/\s*[•·|]\s*(?=[•·|])/g, ' ')
    .replace(/^\s*[•·|\-–—]+\s*/g, '')
    .replace(/\s*[•·|\-–—]+\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return { packaging, remainingNotes };
}
