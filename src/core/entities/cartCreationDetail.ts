/**
 * Cart-creation detail domain entities (plain types, no dependencies).
 * A detail object is a full cart creation including its item lines.
 */

export interface CartCreationDetailUser {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

/** The underlying product reference (e.g. a Taobao/Tmall item). */
export interface CartCreationProduct {
  cartId: string;
  userId: string;
  cartUrl: string;
  cartTitle: string;
  cartPrice: string;
  cartImages: string[];
  createdAt: string;
  updatedAt: string;
}

/** One line item inside a cart creation. */
export interface CartCreationDetailItem {
  detailId: string;
  cartId: string;
  cart: CartCreationProduct;
  detailNotes: string;
  isReject: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A full cart creation (the `data` object of the detail endpoint). */
export interface CartCreationDetail {
  cartCreationId: string;
  userId: string;
  statusId: string;
  statusNotes: string;
  createdAt: string;
  updatedAt: string;
  user: CartCreationDetailUser;
  details: CartCreationDetailItem[];
}

/**
 * Statuses that the admin is allowed to move a cart creation to.
 * Keep in sync with the backend enum values.
 */
export const CART_CREATION_STATUSES = [
  'ON_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;

export type EditableCartStatus = (typeof CART_CREATION_STATUSES)[number];
