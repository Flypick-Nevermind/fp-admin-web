/**
 * Assigned cart-creation domain entities (plain types, no dependencies).
 */

export type AssignedCartCreationStatus =
  | 'ON_PROGRESS'
  | 'ON_CHECK'
  | 'DONE'
  | 'CANCELED';

export interface AssignedCartUser {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface AssignedCartCreation {
  cartCreationId: string;
  userId: string;
  /** The admin this cart is assigned to. */
  userAdminId: string;
  statusId: AssignedCartCreationStatus;
  statusNotes: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  user: AssignedCartUser;
}
