import type { InactiveUser } from '../entities/inactiveUser';

/**
 * Port (repository interface) owned by the domain layer.
 */
export interface InactiveUserRepository {
  getInactive(authorization?: string): Promise<InactiveUser[]>;
}
