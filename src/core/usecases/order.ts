import type {
  OrderDetail,
  OrderListItem,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResult,
} from '../entities/order';
import type { PageResult } from '../entities/page';

export interface OrderListQuery {
  page: number;
  limit: number;
  status?: string;
}

/**
 * Port (repository interface) owned by the domain layer.
 */
export interface OrderRepository {
  list(
    query: OrderListQuery,
    authorization?: string,
  ): Promise<PageResult<OrderListItem>>;

  getById(
    orderId: string,
    authorization?: string,
  ): Promise<OrderDetail>;

  updateStatus(
    payload: UpdateOrderStatusPayload,
    authorization?: string,
  ): Promise<UpdateOrderStatusResult>;
}

export class GetOrdersUseCase {
  private readonly repo: OrderRepository;

  constructor(repo: OrderRepository) {
    this.repo = repo;
  }

  async execute(
    query: OrderListQuery,
    authorization?: string,
  ): Promise<PageResult<OrderListItem>> {
    return this.repo.list(query, authorization);
  }
}

export class GetOrderDetailUseCase {
  private readonly repo: OrderRepository;

  constructor(repo: OrderRepository) {
    this.repo = repo;
  }

  async execute(
    orderId: string,
    authorization?: string,
  ): Promise<OrderDetail> {
    return this.repo.getById(orderId, authorization);
  }
}

export class UpdateOrderStatusUseCase {
  private readonly repo: OrderRepository;

  constructor(repo: OrderRepository) {
    this.repo = repo;
  }

  async execute(
    payload: UpdateOrderStatusPayload,
    authorization?: string,
  ): Promise<UpdateOrderStatusResult> {
    return this.repo.updateStatus(payload, authorization);
  }
}
