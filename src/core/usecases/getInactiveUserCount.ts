import type { InactiveUserCountRepository } from './inactiveUserCount';
import type { InactiveUserCount } from '../entities/inactiveUserCount';

/**
 * Application use case: retrieve the live count of inactive users.
 * Depends only on the InactiveUserCountRepository port. The `authorization`
 * value is a plain string so the domain never touches the store.
 */
export class GetInactiveUserCount {
  private readonly repo: InactiveUserCountRepository;

  constructor(repo: InactiveUserCountRepository) {
    this.repo = repo;
  }

  async execute(authorization?: string): Promise<InactiveUserCount> {
    return this.repo.getInactiveCount(authorization);
  }
}
