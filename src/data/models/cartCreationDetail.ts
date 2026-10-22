/**
 * Raw wire-format DTOs for the cart-creations/{id} detail API (snake_case).
 */

export interface CartCreationDetailUserDTO {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface CartImageDTO {
  cart_image_id?: string;
  cart_id?: string;
  cart_image_value?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartCreationProductDTO {
  cart_id: string;
  user_id: string;
  cart_url: string;
  cart_title: string;
  cart_price: string;
  cart_images: (string | CartImageDTO)[];
  created_at: string;
  updated_at: string;
}


export interface CartCreationDetailItemDTO {
  detail_id: string;
  cart_id: string;
  cart: CartCreationProductDTO;
  detail_notes: string;
  user_notes: string;
  is_reject: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartCreationDetailDTO {
  cart_creation_id: string;
  user_id: string;
  cart_creation_status_id: string;
  cart_creation_status_notes: string;
  created_at: string;
  updated_at: string;
  user: CartCreationDetailUserDTO;
  details: CartCreationDetailItemDTO[];
}

export interface CartCreationDetailResponseDTO {
  code: number;
  data: CartCreationDetailDTO;
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
