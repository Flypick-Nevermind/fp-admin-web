/**
 * Raw DTOs matching the API contract EXACTLY (wire format).
 * Kept snake_case to mirror the backend.
 */

export interface AuthLoginRequestDTO {
  user_email: string;
  user_password: string;
}

export interface AuthUserDTO {
  access_token: string;
  user_admin_id: string;
  user_name: string;
}

export interface AuthResponseMetaDTO {
  limit?: number;
  page?: number;
  total?: number;
  total_pages?: number;
}

/** Envelope wrapping every backend response. */
export interface AuthResponseDTO {
  code: number;
  data: AuthUserDTO;
  errors: string;
  message: string;
  meta: AuthResponseMetaDTO;
  request_id: string;
  success: boolean;
  timestamp: string;
}
