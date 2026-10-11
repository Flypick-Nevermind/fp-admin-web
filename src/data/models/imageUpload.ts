/**
 * Raw wire-format DTOs for the images/upload + images/media API.
 */

export interface ImageUploadDataDTO {
  object_key: string;
  /** NOT used for display (Wasabi blocks public object access). */
  url: string;
  /** NOT used for display. */
  signed_url: string;
  /** NOT used for display. */
  public_url: string;
  expires_in_sec: number;
  original_size_bytes: number;
  compressed_size_bytes: number;
  format: string;
}

export interface ImageUploadResponseDTO {
  code: number;
  success: boolean;
  message: string;
  data: ImageUploadDataDTO;
  errors?: string;
  meta?: {
    limit?: number;
    page?: number;
    total?: number;
    total_pages?: number;
  };
  request_id: string;
  timestamp: string;
}
