import type { CartCreationRepository } from '@/core/usecases/cartCreation';
import type { UnassignedCartCreation, CartCreationUser } from '@/core/entities/cartCreation';
import { CartCreationDataSource } from '@/data/datasources/cartCreation';
import type {
  UnassignedCartCreationDTO,
  CartCreationUserDTO,
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

  async getUnassigned(authorization?: string): Promise<UnassignedCartCreation[]> {
    const response = await this.source.fetchUnassigned(authorization);
    return response.data.map(toEntity);
  }
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
