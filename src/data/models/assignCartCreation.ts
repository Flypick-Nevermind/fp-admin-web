/**
 * Raw wire-format DTOs for the cart-creations/assign API.
 */

export interface AssignCartCreationRequestDTO {
  cart_creation_id: string;
  user_admin_id: string;
}

export interface AssignCartCreationResponseDTO {
  code: number;
  data: {
    cart_creation_id: string;
    user_admin_id: string;
  };
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
