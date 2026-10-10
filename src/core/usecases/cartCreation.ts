import type { UnassignedCartCreation } from '../entities/cartCreation';
import type { PageMeta } from '../entities/page';

/** Query params the caller passes when paging the list. */
export interface CartCreationQuery {
  page: number;
  limit: number;
}

export interface CartCreationPage {
  items: UnassignedCartCreation[];
  meta: PageMeta;
}

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface CartCreationRepository {
  /**
   * Fetch a page of unassigned cart creations.
   * `authorization` is the `Authorization` header value (Bearer JWT)
   * supplied by the presentation layer at call time.
   */
  getUnassigned(
    query: CartCreationQuery,
    authorization?: string,
  ): Promise<CartCreationPage>;
}
