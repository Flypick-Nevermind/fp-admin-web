import type {
  AssignCartCreation,
  AssignCartCreationResult,
} from '../entities/assignCartCreation';

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface AssignCartCreationRepository {
  /**
   * Assign a cart creation to an admin.
   * `authorization` is the `Authorization` header value (Bearer JWT).
   */
  assign(
    input: AssignCartCreation,
    authorization?: string,
  ): Promise<AssignCartCreationResult>;
}
