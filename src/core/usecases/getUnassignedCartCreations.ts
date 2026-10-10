import type {
  CartCreationRepository,
  CartCreationQuery,
  CartCreationPage,
} from './cartCreation';

/**
 * Application use case: retrieve a page of unassigned cart creations.
 * Depends only on the CartCreationRepository port (domain) — the
 * `authorization` value is a plain string so the domain never touches
 * the presentation store.
 */
export class GetUnassignedCartCreations {
  private readonly repo: CartCreationRepository;

  constructor(repo: CartCreationRepository) {
    this.repo = repo;
  }

  async execute(
    query: CartCreationQuery,
    authorization?: string,
  ): Promise<CartCreationPage> {
    return this.repo.getUnassigned(query, authorization);
  }
}
