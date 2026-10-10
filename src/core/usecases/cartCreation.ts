import type { UnassignedCartCreation } from '../entities/cartCreation';

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface CartCreationRepository {
  /**
   * Fetch unassigned cart creations.
   * `authorization` is the `Authorization` header value (Bearer JWT)
   * supplied by the presentation layer at call time.
   */
  getUnassigned(authorization?: string): Promise<UnassignedCartCreation[]>;
}
