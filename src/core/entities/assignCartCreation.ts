/**
 * Assign action request/response entities (plain types, no dependencies).
 */

/** Payload sent to assign a cart creation to an admin. */
export interface AssignCartCreation {
  cartCreationId: string;
  /** The admin to assign the cart to (usually the logged-in admin's id). */
  userAdminId: string;
}

/** Confirmation returned by the backend on success. */
export interface AssignCartCreationResult {
  cartCreationId: string;
  userAdminId: string;
}
