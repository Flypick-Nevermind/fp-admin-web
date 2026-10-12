import { useEffect, useState } from 'react';

/**
 * Local draft for one item line, owned by the page so a single
 * "Save all" button can build the whole update payload.
 */
export interface ItemDraft {
  /** Notes typed in the editor (initial value = the loaded item's notes). */
  detailNotes: string;
  /** Product title (initial = the loaded item's title). */
  cartTitle: string;
  /** Price as text; the page parses it into a number for the payload. */
  cartPrice: string;
  /** Reject toggle. */
  isReject: boolean;
  /** S3 object keys added via the upload (not yet persisted). */
  addedImages: string[];
}

interface UseItemDraftsOptions {
  /**
   * Changes when the loaded detail is re-fetched (e.g. the creation's
   * `updated_at` after a save). The drafts re-seed from `seed` whenever
   * this value changes — so editors always start from the server truth.
   */
  seedKey: string | null;
  seed: ItemDraft[];
}

/**
 * Presentation-layer state for the item editors. Drafts are kept in an
 * array (indexed to match `detail.details`) so the parent page can
 * compute "has changes" and build the sparse update payload.
 */
export function useItemDrafts({ seedKey, seed }: UseItemDraftsOptions) {
  const [drafts, setDrafts] = useState<ItemDraft[]>(seed);

  // Re-seed from the loaded data whenever the data source refetches.
  useEffect(() => {
    setDrafts(seed);
    // `seed` is derived from the same load as `seedKey`; re-seeding on the
    // key change is the intended reset, not a per-render churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  /** Patch a single draft by index. */
  function update(index: number, patch: Partial<ItemDraft>) {
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    );
  }

  return { drafts, update };
}
