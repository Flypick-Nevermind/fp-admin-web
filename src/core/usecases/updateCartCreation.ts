import type {
  UpdateCartCreationCommand,
  UpdateCartCreationResult,
} from '../entities/cartCreationUpdate';

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface UpdateCartCreationRepository {
  /**
   * Persist one atomic cart-creation update. `authorization` is the
   * `Authorization` header value (Bearer JWT).
   */
  update(
    command: UpdateCartCreationCommand,
    authorization?: string,
  ): Promise<UpdateCartCreationResult>;
}
