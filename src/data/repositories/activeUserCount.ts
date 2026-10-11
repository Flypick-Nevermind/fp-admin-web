import type { ActiveUserCountRepository } from '@/core/usecases/activeUserCount';
import type { ActiveUserCount } from '@/core/entities/activeUserCount';
import { ActiveUserCountDataSource } from '@/data/datasources/activeUserCount';

/**
 * Concrete data-layer implementation of the ActiveUserCountRepository port.
 * Maps the wire DTO into the domain entity.
 */
export class ActiveUserCountRepositoryImpl
  implements ActiveUserCountRepository {
  private source: ActiveUserCountDataSource;

  constructor() {
    this.source = new ActiveUserCountDataSource();
  }

  async getActiveCount(authorization?: string): Promise<ActiveUserCount> {
    const response = await this.source.fetchActiveCount(authorization);
    return { count: response.data.count };
  }
}
