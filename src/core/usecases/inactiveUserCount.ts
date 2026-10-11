import type { InactiveUserCount } from '../entities/inactiveUserCount';

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface InactiveUserCountRepository {
  /**
   * Fetch the live count of inactive users.
   * `authorization` is the `Authorization` header value (Bearer JWT).
   */
  getInactiveCount(authorization?: string): Promise<InactiveUserCount>;
}
