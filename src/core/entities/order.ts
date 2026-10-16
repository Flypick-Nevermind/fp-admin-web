/**
 * Order domain entities (pure business types, no external dependencies).
 */

export type OrderStatus =
  | 'WAITING_PAYMENT'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'SETTLEMENT'
  | 'EXPIRED'
  | 'FAILED';

export interface OrderUser {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface OrderItem {
  orderDetailId: string;
  orderId: string;
  cartId?: string;
  productUrl: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  notes: string;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListItem {
  orderId: string;
  orderNumber: string;
  userId: string;
  orderStatus: OrderStatus;
  totalItemPrice: number;
  serviceFee: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  itemCount: number;
  user?: OrderUser;
}

export interface OrderDetail extends OrderListItem {
  items: OrderItem[];
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export interface UpdateOrderStatusResult {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  updatedAt: string;
}
