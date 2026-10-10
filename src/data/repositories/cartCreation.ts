import type {
  CartCreationRepository,
  CartCreationQuery,
  CartCreationPage,
} from '@/core/usecases/cartCreation';
import type { UnassignedCartCreation, CartCreationUser } from '@/core/entities/cartCreation';
import type { PageMeta } from '@/core/entities/page';
import { CartCreationDataSource, type CartCreationQueryParams } from '@/data/datasources/cartCreation';
import type {
  UnassignedCartCreationDTO,
  CartCreationUserDTO,
  CartCreationsMetaDTO,
} from '@/data/models/cartCreation';

/**
 * Concrete data-layer implementation of the CartCreationRepository port.
 * Maps wire DTOs (snake_case) into domain entities (camelCase).
 */
export class CartCreationRepositoryImpl implements CartCreationRepository {
  private source: CartCreationDataSource;

  constructor() {
    this.source = new CartCreationDataSource();
  }

  async getUnassigned(
    query: CartCreationQuery,
    authorization?: string,
  ): Promise<CartCreationPage> {
    const params: CartCreationQueryParams = { page: query.page, limit: query.limit };
    const response = await this.source.fetchUnassigned(params, authorization);
    return {
      items: response.data.items.map(toEntity),
      meta: toMeta(response.data.meta, query),
    };
  }
}

function toMeta(dto: CartCreationsMetaDTO, query: CartCreationQuery): PageMeta {
  return {
    page: dto.page ?? query.page,
    limit: dto.limit ?? query.limit,
    total: dto.total ?? 0,
    total_pages: dto.total_pages ?? 0,
  };
}

function toUser(dto: CartCreationUserDTO): CartCreationUser {
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    userEmail: dto.user_email,
    userPhone: dto.user_phone,
  };
}

function toEntity(dto: UnassignedCartCreationDTO): UnassignedCartCreation {
  return {
    cartCreationId: dto.cart_creation_id,
    userId: dto.user_id,
    statusId: dto.cart_creation_status_id as UnassignedCartCreation['statusId'],
    statusNotes: dto.cart_creation_status_notes ?? '',
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    user: toUser(dto.user),
  };
}
