/**
 * Inactive / prospect user domain entity (plain type, no dependencies).
 * Sourced from the `/users/inactive` endpoint.
 */
export interface InactiveUser {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  /** Tri-state: true=aktif, false=inactive, null=belum diaktifkan */
  isActive: boolean | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
