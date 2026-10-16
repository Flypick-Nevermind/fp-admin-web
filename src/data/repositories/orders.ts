import type {
  OrderRepository,
  OrderListQuery,
} from '@/core/usecases/order';
import type {
  OrderDetail,
  OrderItem,
  OrderListItem,
  OrderStatus,
  OrderUser,
  PaymentStatus,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResult,
} from '@/core/entities/order';
import type { PageMeta, PageResult } from '@/core/entities/page';
import {
  OrdersDataSource,
  type OrderQueryParams,
} from '@/data/datasources/orders';
import type {
  AdminOrderListItemDTO,
  AdminOrderWithDetailsDTO,
  OrderItemDTO,
  OrderUserDTO,
} from '@/data/models/order';

export class OrderRepositoryImpl implements OrderRepository {
  private readonly source: OrdersDataSource;

  constructor() {
    this.source = new OrdersDataSource();
  }

  async list(
    query: OrderListQuery,
    authorization?: string,
  ): Promise<PageResult<OrderListItem>> {
    const params: OrderQueryParams = {
      page: query.page,
      limit: query.limit,
      status: query.status,
    };

    const res = await this.source.fetchOrders(params, authorization);

    return {
      items: (res.data.orders || []).map(toOrderListItem),
      meta: toMeta(res.data.meta, query),
    };
  }

  async getById(
    orderId: string,
    authorization?: string,
  ): Promise<OrderDetail> {
    const res = await this.source.fetchOrderDetail(orderId, authorization);
    return toOrderDetail(res.data);
  }

  async updateStatus(
    payload: UpdateOrderStatusPayload,
    authorization?: string,
  ): Promise<UpdateOrderStatusResult> {
    const res = await this.source.updateOrderStatus(
      {
        order_id: payload.orderId,
        order_status: payload.orderStatus,
        payment_status: payload.paymentStatus,
      },
      authorization,
    );

    return {
      orderId: res.data.order_id,
      orderStatus: res.data.order_status as OrderStatus,
      paymentStatus: res.data.payment_status as PaymentStatus,
      updatedAt: res.data.updated_at,
    };
  }
}

function toMeta(meta: PageMeta | undefined, query: OrderListQuery): PageMeta {
  return {
    page: meta?.page ?? query.page,
    limit: meta?.limit ?? query.limit,
    total: meta?.total ?? 0,
    total_pages: meta?.total_pages ?? 1,
  };
}

function toUser(dto?: OrderUserDTO): OrderUser | undefined {
  if (!dto) return undefined;
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    userEmail: dto.user_email,
    userPhone: dto.user_phone,
  };
}

function toOrderItem(dto: OrderItemDTO): OrderItem {
  return {
    orderDetailId: dto.order_detail_id,
    orderId: dto.order_id,
    cartId: dto.cart_id,
    productUrl: dto.product_url,
    productTitle: dto.product_title,
    productPrice: Number(dto.product_price) || 0,
    productImage: dto.product_image,
    quantity: dto.quantity,
    notes: dto.notes,
    subtotal: Number(dto.subtotal) || 0,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toOrderListItem(dto: AdminOrderListItemDTO): OrderListItem {
  return {
    orderId: dto.order_id,
    orderNumber: dto.order_number,
    userId: dto.user_id,
    orderStatus: dto.order_status as OrderStatus,
    totalItemPrice: Number(dto.total_item_price) || 0,
    serviceFee: Number(dto.service_fee) || 0,
    shippingFee: Number(dto.shipping_fee) || 0,
    totalAmount: Number(dto.total_amount) || 0,
    paymentMethod: dto.payment_method,
    paymentStatus: dto.payment_status as PaymentStatus,
    recipientName: dto.recipient_name,
    recipientPhone: dto.recipient_phone,
    shippingAddress: dto.shipping_address,
    shippingCity: dto.shipping_city,
    shippingPostalCode: dto.shipping_postal_code || '',
    shippingNotes: dto.shipping_notes || '',
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    itemCount: dto.item_count,
    user: toUser(dto.user),
  };
}

function toOrderDetail(dto: AdminOrderWithDetailsDTO): OrderDetail {
  const base = toOrderListItem(dto);
  return {
    ...base,
    items: (dto.items || []).map(toOrderItem),
  };
}
