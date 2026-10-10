import type {
  InactiveUserRepository,
  InactiveUserQuery,
  InactiveUserPage,
} from './inactiveUser';

/**
 * Application use case: retrieve a page of inactive / prospect users.
 * Depends only on the InactiveUserRepository port (domain). The
 * `authorization` value is a plain string so the domain never touches
 * the presentation store.
 */
export class GetInactiveUsers {
  private readonly repo: InactiveUserRepository;

  constructor(repo: InactiveUserRepository) {
    this.repo = repo;
  }

  async execute(
    query: InactiveUserQuery,
    authorization?: string,
  ): Promise<InactiveUserPage> {
    return this.repo.getInactive(query, authorization);
  }
}
