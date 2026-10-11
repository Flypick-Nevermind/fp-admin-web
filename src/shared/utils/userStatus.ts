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
    return { label: 'Aktif', cls: 'bg-success-soft text-success' };
  }
  if (isActive === false) {
    return { label: 'Inactive', cls: 'bg-danger-soft text-danger' };
  }
  // null (explicit null or absent) → belum diaktifkan
  return { label: 'Belum Diaktifkan', cls: 'bg-warning-soft text-warning' };
}
