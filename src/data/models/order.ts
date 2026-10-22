import type { PageMeta } from '@/core/entities/page';

export interface OrderUserDTO {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface OrderItemDTO {
  order_detail_id: string;
  order_id: string;
  cart_id?: string;
  product_url: string;
  product_title: string;
  product_price: number;
  product_image: string;
  quantity: number;
  notes: string;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderListItemDTO {
  order_id: string;
  order_number: string;
  user_id: string;
  order_status: string;
  total_item_price: number;
  service_fee: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  shipping_notes?: string;
  payment_proof_url?: string;
  created_at: string;
  updated_at: string;
  item_count: number;
  user?: OrderUserDTO;
}

export interface AdminOrdersPageDTO {
  orders: AdminOrderListItemDTO[];
  meta: PageMeta;
}

export interface AdminOrderWithDetailsDTO extends AdminOrderListItemDTO {
  items: OrderItemDTO[];
}

export interface OrdersListResponseDTO {
  code: number;
  success: boolean;
  message: string;
  data: AdminOrdersPageDTO;
}

export interface OrderDetailResponseDTO {
  code: number;
  success: boolean;
  message: string;
  data: AdminOrderWithDetailsDTO;
}

export interface UpdateOrderStatusRequestDTO {
  order_id: string;
  order_status?: string;
  payment_status?: string;
}

export interface UpdateOrderStatusResponseDTO {
  code: number;
  success: boolean;
  message: string;
  data: {
    order_id: string;
    order_status: string;
    payment_status: string;
    updated_at: string;
  };
}
