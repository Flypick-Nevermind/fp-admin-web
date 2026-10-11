import type { CartCreationDetailRepository } from '@/core/usecases/cartCreationDetail';
import type {
  CartCreationDetail,
  CartCreationDetailUser,
  CartCreationDetailItem,
  CartCreationProduct,
} from '@/core/entities/cartCreationDetail';
import type {
  CartCreationDetailDTO,
  CartCreationDetailUserDTO,
  CartCreationDetailItemDTO,
  CartCreationProductDTO,
} from '@/data/models/cartCreationDetail';
import { CartCreationDetailDataSource } from '@/data/datasources/cartCreationDetail';

/**
 * Concrete data-layer implementation of the CartCreationDetailRepository
 * port. Maps wire DTOs (snake_case) into domain entities (camelCase).
 */
export class CartCreationDetailRepositoryImpl
  implements CartCreationDetailRepository {
  private source: CartCreationDetailDataSource;

  constructor() {
    this.source = new CartCreationDetailDataSource();
  }

  async getDetail(
    cartCreationId: string,
    authorization?: string,
  ): Promise<CartCreationDetail> {
    const response = await this.source.fetchDetail(cartCreationId, authorization);
    return toEntity(response.data);
  }
}

function toUser(dto: CartCreationDetailUserDTO): CartCreationDetailUser {
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    userEmail: dto.user_email,
    userPhone: dto.user_phone,
  };
}

function toProduct(dto: CartCreationProductDTO): CartCreationProduct {
  return {
    cartId: dto.cart_id,
    userId: dto.user_id,
    cartUrl: dto.cart_url,
    cartTitle: dto.cart_title ?? '',
    cartPrice: dto.cart_price ?? '',
    cartImages: dto.cart_images ?? [],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toItem(dto: CartCreationDetailItemDTO): CartCreationDetailItem {
  return {
    detailId: dto.detail_id,
    cartId: dto.cart_id,
    cart: toProduct(dto.cart),
    detailNotes: dto.detail_notes ?? '',
    isReject: dto.is_reject,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toEntity(dto: CartCreationDetailDTO): CartCreationDetail {
  return {
    cartCreationId: dto.cart_creation_id,
    userId: dto.user_id,
    statusId: dto.cart_creation_status_id,
    statusNotes: dto.cart_creation_status_notes ?? '',
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    user: toUser(dto.user),
    details: dto.details.map(toItem),
  };
}
