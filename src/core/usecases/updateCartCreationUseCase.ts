import type { UpdateCartCreationRepository } from './updateCartCreation';
import type {
  UpdateCartCreationCommand,
  UpdateCartCreationResult,
} from '../entities/cartCreationUpdate';

/**
 * Application use case: update a cart creation (status + notes + item
 * lines) in one atomic call. Depends only on the
 * UpdateCartCreationRepository port. The `authorization` value is a plain
 * string so the domain never touches the presentation store.
 */
export class UpdateCartCreationUseCase {
  private readonly repo: UpdateCartCreationRepository;

  constructor(repo: UpdateCartCreationRepository) {
    this.repo = repo;
  }

  async execute(
    command: UpdateCartCreationCommand,
    authorization?: string,
  ): Promise<UpdateCartCreationResult> {
    const result = await this.repo.update(command, authorization);
    if (!result.cartCreationId) {
      throw new Error('Update response did not include a cart creation id');
    }
    return result;
  }
}
