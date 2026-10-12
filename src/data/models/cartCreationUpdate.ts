/**
 * Raw wire-format DTOs for the cart-creations/update API (snake_case).
 * Mirrors the Go `UpdateCartCreationRequest` / `UpdateCartCreationResponse`.
 *
 * The Go structs are POINTER-BASED: an omitted JSON key decodes to a nil
 * pointer, which the use case treats as "leave this column untouched".
 * So optional fields here must be OMITTED from the JSON (via undefined),
 * never sent as empty/zero values.
 */

/** One nested image row of ms_flypick_cart_image. */
export interface UpdateCartImageDTO {
  cart_id: string;
  cart_image_value: string;
}

/** The nested ms_flypick_cart update payload. */
export interface UpdateCartDTO {
  cart_id: string;
  /** Written when present (non-nil); omitted = column untouched. */
  cart_url?: string;
  /** Written when present (non-nil); omitted = column untouched. */
  cart_title?: string;
  /**
   * Numeric — the backend stores it as varchar, expects a float in JSON.
   * Omitted = column untouched.
   */
  cart_price?: number;
  /**
   * When a non-nil (i.e. present) slice, REPLACES the cart's whole image
   * set. Omit to leave the current images untouched.
   */
  ms_flypick_cart_images?: UpdateCartImageDTO[];
}

/** One element of the details array. */
export interface UpdateCartCreationDetailDTO {
  cart_creation_detail_id: string;
  /** Overwrites the detail's notes when present; omitted = untouched. */
  cart_creation_detail_notes?: string;
  cart_creation_id: string;
  cart_id: string;
  /** Omitted = the flag is untouched. */
  is_reject?: boolean;
  /**
   * Omitted = the cart row and its images are untouched. When present on
   * an accepted detail it must carry title + notes + >= 1 image + a
   * non-zero price, else the backend 422s.
   */
  ms_flypick_cart?: UpdateCartDTO;
}

export interface UpdateCartCreationRequestDTO {
  cart_creation_id: string;
  /** Omitted/empty = the creation's admin is untouched. */
  user_admin_id?: string;
  /** Omitted/empty = the status column is untouched. */
  cart_creation_status_id?: string;
  /** Omitted = the notes column is untouched. */
  cart_creation_status_notes?: string;
  ms_flypick_cart_creation_details: UpdateCartCreationDetailDTO[];
}

export interface UpdateCartCreationDataDTO {
  cart_creation_id: string;
  user_admin_id?: string;
  cart_creation_status_id?: string;
  updated_at: string;
}

/** A single 422 business-rule issue (`errors[]` on the wire). */
export interface ValidationErrorDetailDTO {
  field: string;
  tag?: string;
  message: string;
}

export interface UpdateCartCreationResponseDTO {
  code: number;
  data: UpdateCartCreationDataDTO | null;
  /** Plain string on 400/500, per-field detail array on 422. */
  errors: string | ValidationErrorDetailDTO[];
  message: string;
  request_id: string;
  success: boolean;
  timestamp: string;
}
