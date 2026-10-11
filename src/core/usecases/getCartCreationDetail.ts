import type { CartCreationDetailRepository } from './cartCreationDetail';
import type { CartCreationDetail } from '../entities/cartCreationDetail';

/**
 * Application use case: retrieve a single cart creation with details.
 * Depends only on the CartCreationDetailRepository port. The `authorization`
 * value is a plain string so the domain never touches the store.
 */
export class GetCartCreationDetail {
  private readonly repo: CartCreationDetailRepository;

  constructor(repo: CartCreationDetailRepository) {
    this.repo = repo;
  }

  async execute(
    cartCreationId: string,
    authorization?: string,
  ): Promise<CartCreationDetail> {
    return this.repo.getDetail(cartCreationId, authorization);
  }
}
