/**
 * Cart-creation domain entities (plain types, no dependencies).
 */

export type CartCreationStatus =
  | 'ON_PROGRESS'
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'UNASSIGNED';

export interface CartCreationUser {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface UnassignedCartCreation {
  cartCreationId: string;
  userId: string;
  statusId: CartCreationStatus;
  statusNotes: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  user: CartCreationUser;
}
