import type { CartCreationDetail } from '../entities/cartCreationDetail';

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface CartCreationDetailRepository {
  /**
   * Fetch a single cart creation with its item lines.
   * `authorization` is the `Authorization` header value (Bearer JWT).
   */
  getDetail(
    cartCreationId: string,
    authorization?: string,
  ): Promise<CartCreationDetail>;
}
