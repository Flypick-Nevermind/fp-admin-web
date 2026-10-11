/**
 * Raw wire-format DTOs for the users/active/count API.
 */

export interface ActiveUserCountDTO {
  count: number;
}

export interface ActiveUserCountResponseDTO {
  code: number;
  data: ActiveUserCountDTO;
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
