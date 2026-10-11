/**
 * Raw wire-format DTOs for the users/inactive/count API.
 */

export interface InactiveUserCountDTO {
  count: number;
}

export interface InactiveUserCountResponseDTO {
  code: number;
  data: InactiveUserCountDTO;
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
