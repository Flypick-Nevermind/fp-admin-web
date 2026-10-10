import type { CartCreationRepository } from './cartCreation';
import type { UnassignedCartCreation } from '../entities/cartCreation';

/**
 * Application use case: retrieve unassigned cart creations.
 * Depends only on the CartCreationRepository port (domain) — the
 * `authorization` value is a plain string so the domain never touches
 * the presentation store.
 */
export class GetUnassignedCartCreations {
  private readonly repo: CartCreationRepository;

  constructor(repo: CartCreationRepository) {
    this.repo = repo;
  }

  async execute(authorization?: string): Promise<UnassignedCartCreation[]> {
    return this.repo.getUnassigned(authorization);
  }
}
