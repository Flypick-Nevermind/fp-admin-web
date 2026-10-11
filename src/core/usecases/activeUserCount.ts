import type { ActiveUserCount } from '../entities/activeUserCount';

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface ActiveUserCountRepository {
  /**
   * Fetch the live count of active users.
   * `authorization` is the `Authorization` header value (Bearer JWT).
   */
  getActiveCount(authorization?: string): Promise<ActiveUserCount>;
}
