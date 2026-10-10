import type { InactiveUserRepository } from '@/core/usecases/inactiveUser';
import type { InactiveUser } from '@/core/entities/inactiveUser';
import type { InactiveUserDTO } from '@/data/models/inactiveUser';
import { InactiveUserDataSource } from '@/data/datasources/inactiveUser';

/**
 * Concrete data-layer implementation of the InactiveUserRepository port.
 * Maps wire DTOs (snake_case) into domain entities (camelCase).
 */
export class InactiveUserRepositoryImpl implements InactiveUserRepository {
  private source: InactiveUserDataSource;

  constructor() {
    this.source = new InactiveUserDataSource();
  }

  async getInactive(authorization?: string): Promise<InactiveUser[]> {
    const response = await this.source.fetchInactive(authorization);
    return response.data.map(toEntity);
  }
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
