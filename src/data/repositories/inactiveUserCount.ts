import type { InactiveUserCountRepository } from '@/core/usecases/inactiveUserCount';
import type { InactiveUserCount } from '@/core/entities/inactiveUserCount';
import { InactiveUserCountDataSource } from '@/data/datasources/inactiveUserCount';

/**
 * Concrete data-layer implementation of the InactiveUserCountRepository
 * port. Maps the wire DTO into the domain entity.
 */
export class InactiveUserCountRepositoryImpl
  implements InactiveUserCountRepository {
  private source: InactiveUserCountDataSource;

  constructor() {
    this.source = new InactiveUserCountDataSource();
  }

  async getInactiveCount(authorization?: string): Promise<InactiveUserCount> {
    const response = await this.source.fetchInactiveCount(authorization);
    return { count: response.data.count };
  }
}
