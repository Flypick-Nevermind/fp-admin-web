import type { InactiveUserRepository } from './inactiveUser';
import type { InactiveUser } from '../entities/inactiveUser';

/**
 * Application use case: retrieve inactive / prospect users.
 * Depends only on the InactiveUserRepository port (domain). The
 * `authorization` value is a plain string so the domain never touches
 * the presentation store.
 */
export class GetInactiveUsers {
  private readonly repo: InactiveUserRepository;

  constructor(repo: InactiveUserRepository) {
    this.repo = repo;
  }

  async execute(authorization?: string): Promise<InactiveUser[]> {
    return this.repo.getInactive(authorization);
  }
}
