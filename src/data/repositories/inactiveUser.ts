import type {
  InactiveUserRepository,
  InactiveUserQuery,
  InactiveUserPage,
} from '@/core/usecases/inactiveUser';
import type { InactiveUser } from '@/core/entities/inactiveUser';
import type { PageMeta } from '@/core/entities/page';
import type { InactiveUserDTO } from '@/data/models/inactiveUser';
import { InactiveUserDataSource, type InactiveQueryParams } from '@/data/datasources/inactiveUser';

/**
 * Concrete data-layer implementation of the InactiveUserRepository port.
 * Maps wire DTOs (snake_case) into domain entities (camelCase).
 */
export class InactiveUserRepositoryImpl implements InactiveUserRepository {
  private source: InactiveUserDataSource;

  constructor() {
    this.source = new InactiveUserDataSource();
  }

  async getInactive(
    query: InactiveUserQuery,
    authorization?: string,
  ): Promise<InactiveUserPage> {
    const params: InactiveQueryParams = { page: query.page, limit: query.limit };
    const response = await this.source.fetchInactive(params, authorization);
    const meta = response.data.meta;
    return {
      items: response.data.items.map(toEntity),
      meta: toMeta(meta, query),
    };
  }
}

function toMeta(
  dto: {
    limit?: number;
    page?: number;
    total?: number;
    total_pages?: number;
  },
  query: InactiveUserQuery,
): PageMeta {
  return {
    page: dto.page ?? query.page,
    limit: dto.limit ?? query.limit,
    total: dto.total ?? 0,
    total_pages: dto.total_pages ?? 0,
  };
}

function toEntity(dto: InactiveUserDTO): InactiveUser {
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    userEmail: dto.user_email,
    userPhone: dto.user_phone,
    // Preserve tri-state: absent → null (belum diaktifkan); false stays false.
    isActive: dto.is_active ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
