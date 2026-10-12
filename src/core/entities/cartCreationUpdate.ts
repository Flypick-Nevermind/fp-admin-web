/**
 * Update-cart-creation command/result entities (plain types, no deps).
 *
 * The backend is POINTER-BASED: every optional field that is omitted from
 * the wire payload leaves the corresponding DB column untouched. So the
 * command is sparse — callers set ONLY the fields that actually changed,
 * and the repository translates `null`/absent into JSON omission.
 *
 * Business rule (enforced by the backend, mirrored here): every detail in
 * the payload whose `isReject` is null or false must carry a full valid
 * cart payload (non-empty title + notes + >= 1 image + non-zero price).
 * Rejected details may be fully sparse.
 */

/** One sparse item-line update. */
export interface UpdateCartCreationDetailCommand {
  detailId: string;
  cartId: string;
  /** New detail notes; `null` = leave the column untouched. */
  detailNotes: string | null;
  /** New reject flag; `null` = leave the column untouched. */
  isReject: boolean | null;
  /**
   * Nested cart update; `null` = leave the cart row and its images
   * untouched. Must be fully populated whenever this detail is accepted
   * (isReject null or false).
   */
  cart: {
    /** `null` = column untouched. Must be non-empty when accepted. */
    cartTitle: string | null;
    /** `null` = column untouched. Must be non-zero when accepted. */
    cartPrice: number | null;
    /**
     * The COMPLETE image set (existing + newly uploaded) — the backend
     * REPLACES the set when present. `null` = leave images untouched.
     */
    images: string[] | null;
  } | null;
}

/** The full command for one update call. */
export interface UpdateCartCreationCommand {
  cartCreationId: string;
  /** The logged-in admin's id (resolves to `user_admin_id`). */
  userAdminId: string;
  /** New creation status; omit to leave the status column untouched. */
  statusId?: string;
  /** New status notes; omit to leave the notes column untouched. */
  statusNotes?: string;
  /** Sparse detail updates — usually 0 or 1 entries per call. */
  details: UpdateCartCreationDetailCommand[];
}

/** Confirmation returned by the backend after a successful update. */
export interface UpdateCartCreationResult {
  cartCreationId: string;
  statusId: string;
  updatedAt: string;
}
