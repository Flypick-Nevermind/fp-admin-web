import type {
  AssignedCartCreationRepository,
  AssignedCartCreationQuery,
  AssignedCartCreationPage,
} from './assignedCartCreation';

/**
 * Application use case: retrieve a page of assigned cart creations for an
 * admin. Depends only on the AssignedCartCreationRepository port. The
 * `authorization` value is a plain string so the domain never touches
 * the presentation store.
 */
export class GetAssignedCartCreations {
  private readonly repo: AssignedCartCreationRepository;

  constructor(repo: AssignedCartCreationRepository) {
    this.repo = repo;
  }

  async execute(
    query: AssignedCartCreationQuery,
    authorization?: string,
  ): Promise<AssignedCartCreationPage> {
    return this.repo.getAssigned(query, authorization);
  }
}
