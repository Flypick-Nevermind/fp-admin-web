import type { AssignedCartCreation } from '../entities/assignedCartCreation';
import type { PageMeta } from '../entities/page';

/** Query params the caller passes when paging the assigned list. */
export interface AssignedCartCreationQuery {
  page: number;
  limit: number;
  /** The admin whose assigned carts to fetch. */
  userAdminId: string;
}

export interface AssignedCartCreationPage {
  items: AssignedCartCreation[];
  meta: PageMeta;
}

/**
 * Port (repository interface) owned by the domain layer.
 * Data layer provides the concrete implementation.
 */
export interface AssignedCartCreationRepository {
  /**
   * Fetch a page of assigned cart creations for a given admin.
   * `authorization` is the `Authorization` header value (Bearer JWT).
   */
  getAssigned(
    query: AssignedCartCreationQuery,
    authorization?: string,
  ): Promise<AssignedCartCreationPage>;
}
