/**
 * Raw wire-format DTOs for the users-inactive API (snake_case, as the
 * backend returns them).
 */

export interface InactiveUserDTO {
  created_at: string;
  /** Tri-state as the backend sends it: true / false / null */
  is_active?: boolean | null;
  updated_at: string;
  user_email: string;
  user_id: string;
  user_name: string;
  user_phone: string;
}

export interface InactiveUsersResponseDTO {
  code: number;
  data: InactiveUserDTO[];
  errors: string;
  message: string;
  meta: {
    limit?: number;
    page?: number;
    total?: number;
    total_pages?: number;
  };
  request_id: string;
  success: boolean;
  timestamp: string;
}
