/**
 * Tri-state helper for the `is_active` user flag.
 *
 *   true  → already activated ("Aktif")
 *   false → inactive ("Inactive")
 *   null  → not yet activated ("Belum Diaktifkan")
 *
 * Returns a Duolingo-style label + badge classes so the UI stays DRY.
 */
export type UserActiveState = boolean | null;

export interface ActiveStateMeta {
  label: string;
  cls: string;
}

export function userActiveState(isActive: UserActiveState): ActiveStateMeta {
  if (isActive === true) {
    return { label: 'Aktif', cls: 'bg-duo-green/20 text-duo-green-dark' };
  }
  if (isActive === false) {
    return { label: 'Inactive', cls: 'bg-duo-red/15 text-duo-red' };
  }
  // null (explicit null or absent) → belum diaktifkan
  return { label: 'Belum Diaktifkan', cls: 'bg-duo-yellow/40 text-[#7a5b00]' };
}
