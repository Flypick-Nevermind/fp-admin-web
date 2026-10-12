import type { UpdateCartCreationRepository } from '@/core/usecases/updateCartCreation';
import type {
  UpdateCartCreationCommand,
  UpdateCartCreationResult,
} from '@/core/entities/cartCreationUpdate';
import {
  UpdateCartCreationDataSource,
} from '@/data/datasources/cartCreationUpdate';
import type {
  UpdateCartCreationDetailDTO,
  UpdateCartCreationRequestDTO,
  UpdateCartDTO,
} from '@/data/models/cartCreationUpdate';

/**
 * Concrete data-layer implementation of the UpdateCartCreationRepository
 * port. Maps the sparse domain command (camelCase) onto the wire DTO
 * (snake_case), preserving the backend's pointer semantics:
 *
 *   - `null`/absent command values become OMITTED JSON keys (undefined),
 *     which decode to nil Go pointers → "leave the column untouched".
 *   - Never coerce an absent value into an empty string / 0 / [] — those
 *     would be written and can trip the accepted-item business rules.
 */
export class UpdateCartCreationRepositoryImpl
  implements UpdateCartCreationRepository {
  private source: UpdateCartCreationDataSource;

  constructor() {
    this.source = new UpdateCartCreationDataSource();
  }

  async update(
    command: UpdateCartCreationCommand,
    authorization?: string,
  ): Promise<UpdateCartCreationResult> {
    const body: UpdateCartCreationRequestDTO = {
      cart_creation_id: command.cartCreationId,
      ms_flypick_cart_creation_details: command.details.map((d) =>
        this.toDetailDTO(d, command.cartCreationId),
      ),
    };
    if (command.userAdminId) body.user_admin_id = command.userAdminId;
    if (command.statusId) body.cart_creation_status_id = command.statusId;
    if (command.statusNotes !== undefined) {
      body.cart_creation_status_notes = command.statusNotes;
    }

    const response = await this.source.update(body, authorization);
    const data = response.data ?? {
      cart_creation_id: command.cartCreationId,
      updated_at: '',
    };
    return {
      cartCreationId: data.cart_creation_id,
      statusId: data.cart_creation_status_id ?? command.statusId ?? '',
      updatedAt: data.updated_at,
    };
  }

  private toDetailDTO(
    d: UpdateCartCreationCommand['details'][number],
    cartCreationId: string,
  ): UpdateCartCreationDetailDTO {
    const dto: UpdateCartCreationDetailDTO = {
      cart_creation_detail_id: d.detailId,
      cart_creation_id: cartCreationId,
      cart_id: d.cartId,
    };
    if (d.detailNotes !== null) {
      dto.cart_creation_detail_notes = d.detailNotes;
    }
    if (d.isReject !== null) {
      dto.is_reject = d.isReject;
    }
    if (d.cart !== null) {
      dto.ms_flypick_cart = this.toCartDTO(d.cart, d.cartId);
    }
    return dto;
  }

  private toCartDTO(
    cart: NonNullable<UpdateCartCreationCommand['details'][number]['cart']>,
    cartId: string,
  ): UpdateCartDTO {
    const dto: UpdateCartDTO = { cart_id: cartId };
    if (cart.cartTitle !== null) dto.cart_title = cart.cartTitle;
    if (cart.cartPrice !== null) dto.cart_price = cart.cartPrice;
    if (cart.images !== null) {
      dto.ms_flypick_cart_images = cart.images.map((value) => ({
        cart_id: cartId,
        cart_image_value: value,
      }));
    }
    return dto;
  }
}
