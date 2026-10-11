import type { AssignCartCreationRepository } from '@/core/usecases/assignCartCreation';
import type {
  AssignCartCreation,
  AssignCartCreationResult,
} from '@/core/entities/assignCartCreation';
import { AssignCartCreationDataSource } from '@/data/datasources/assignCartCreation';

/**
 * Concrete data-layer implementation of the AssignCartCreationRepository
 * port. Maps domain input (camelCase) to the wire DTO (snake_case).
 */
export class AssignCartCreationRepositoryImpl
  implements AssignCartCreationRepository {
  private source: AssignCartCreationDataSource;

  constructor() {
    this.source = new AssignCartCreationDataSource();
  }

  async assign(
    input: AssignCartCreation,
    authorization?: string,
  ): Promise<AssignCartCreationResult> {
    const response = await this.source.assign(
      {
        cart_creation_id: input.cartCreationId,
        user_admin_id: input.userAdminId,
      },
      authorization,
    );
    return {
      cartCreationId: response.data.cart_creation_id,
      userAdminId: response.data.user_admin_id,
    };
  }
}
