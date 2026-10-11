import type { AssignCartCreationRepository } from './assignCartCreation';
import type {
  AssignCartCreation,
  AssignCartCreationResult,
} from '../entities/assignCartCreation';

/**
 * Application use case: assign a cart creation to an admin.
 * Depends only on the AssignCartCreationRepository port. The
 * `authorization` value is a plain string so the domain never touches
 * the store.
 */
export class AssignCartCreationUseCase {
  private readonly repo: AssignCartCreationRepository;

  constructor(repo: AssignCartCreationRepository) {
    this.repo = repo;
  }

  async execute(
    input: AssignCartCreation,
    authorization?: string,
  ): Promise<AssignCartCreationResult> {
    const result = await this.repo.assign(input, authorization);
    if (!result.cartCreationId) {
      throw new Error('Assign response did not include a cart creation id');
    }
    return result;
  }
}
