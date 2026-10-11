import type { ActiveUserCountRepository } from './activeUserCount';
import type { ActiveUserCount } from '../entities/activeUserCount';

/**
 * Application use case: retrieve the live count of active users.
 * Depends only on the ActiveUserCountRepository port. The `authorization`
 * value is a plain string so the domain never touches the store.
 */
export class GetActiveUserCount {
  private readonly repo: ActiveUserCountRepository;

  constructor(repo: ActiveUserCountRepository) {
    this.repo = repo;
  }

  async execute(authorization?: string): Promise<ActiveUserCount> {
    return this.repo.getActiveCount(authorization);
  }
}
