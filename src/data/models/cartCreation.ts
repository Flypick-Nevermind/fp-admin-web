/**
 * Raw wire-format DTOs for the cart-creations API (snake_case, as the
 * backend returns them). Kept separate from domain entities.
 */

export interface CartCreationUserDTO {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface UnassignedCartCreationDTO {
  cart_creation_id: string;
  user_id: string;
  cart_creation_status_id: string;
  cart_creation_status_notes: string;
  created_at: string;
  updated_at: string;
  user: CartCreationUserDTO;
}

export interface CartCreationsMetaDTO {
  limit?: number;
  page?: number;
  total?: number;
  total_pages?: number;
}

export interface CartCreationsDataDTO {
  items: UnassignedCartCreationDTO[];
  meta: CartCreationsMetaDTO;
}

export interface CartCreationsResponseDTO {
  code: number;
  success: boolean;
  message: string;
  data: CartCreationsDataDTO;
  timestamp: string;
  request_id: string;
}
