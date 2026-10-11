import type {
  AssignedCartCreationRepository,
  AssignedCartCreationQuery,
  AssignedCartCreationPage,
} from '@/core/usecases/assignedCartCreation';
import type {
  AssignedCartCreation,
  AssignedCartUser,
} from '@/core/entities/assignedCartCreation';
import type { PageMeta } from '@/core/entities/page';
import {
  AssignedCartCreationDataSource,
  type AssignedCartQueryParams,
} from '@/data/datasources/assignedCartCreation';
import type {
  AssignedCartCreationDTO,
  AssignedCartUserDTO,
  AssignedCartCreationsMetaDTO,
} from '@/data/models/assignedCartCreation';

/**
 * Concrete data-layer implementation of the AssignedCartCreationRepository
 * port. Maps wire DTOs (snake_case) into domain entities (camelCase).
 */
export class AssignedCartCreationRepositoryImpl
  implements AssignedCartCreationRepository {
  private source: AssignedCartCreationDataSource;

  constructor() {
    this.source = new AssignedCartCreationDataSource();
  }

  async getAssigned(
    query: AssignedCartCreationQuery,
    authorization?: string,
  ): Promise<AssignedCartCreationPage> {
    const params: AssignedCartQueryParams = {
      page: query.page,
      limit: query.limit,
      userAdminId: query.userAdminId,
    };
    const response = await this.source.fetchAssigned(params, authorization);
    return {
      items: response.data.items.map(toEntity),
      meta: toMeta(response.data.meta, query),
    };
  }
}

function toMeta(
  dto: AssignedCartCreationsMetaDTO,
  query: AssignedCartCreationQuery,
): PageMeta {
  return {
    page: dto.page ?? query.page,
    limit: dto.limit ?? query.limit,
    total: dto.total ?? 0,
    total_pages: dto.total_pages ?? 0,
  };
}

function toUser(dto: AssignedCartUserDTO): AssignedCartUser {
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    userEmail: dto.user_email,
    userPhone: dto.user_phone,
  };
}

function toEntity(dto: AssignedCartCreationDTO): AssignedCartCreation {
  return {
    cartCreationId: dto.cart_creation_id,
    userId: dto.user_id,
    userAdminId: dto.user_admin_id,
    statusId: dto.cart_creation_status_id as AssignedCartCreation['statusId'],
    statusNotes: dto.cart_creation_status_notes ?? '',
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    user: toUser(dto.user),
  };
}
