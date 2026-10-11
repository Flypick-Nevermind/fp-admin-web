/**
 * Raw wire-format DTOs for the cart-creations/assigned API (snake_case).
 */

export interface AssignedCartUserDTO {
  user_email: string;
  user_id: string;
  user_name: string;
  user_phone: string;
}

export interface AssignedCartCreationDTO {
  cart_creation_id: string;
  user_id: string;
  user_admin_id: string;
  cart_creation_status_id: string;
  cart_creation_status_notes: string;
  created_at: string;
  updated_at: string;
  user: AssignedCartUserDTO;
}

export interface AssignedCartCreationsMetaDTO {
  limit?: number;
  page?: number;
  total?: number;
  total_pages?: number;
}

export interface AssignedCartCreationsDataDTO {
  items: AssignedCartCreationDTO[];
  meta: AssignedCartCreationsMetaDTO;
}

export interface AssignedCartCreationsResponseDTO {
  code: number;
  data: AssignedCartCreationsDataDTO;
  errors: string;
  message: string;
  meta: AssignedCartCreationsMetaDTO;
  request_id: string;
  success: boolean;
  timestamp: string;
}
