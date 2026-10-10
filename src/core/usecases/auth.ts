import type { AuthSession, LoginCredentials } from '../entities/auth';

/**
 * Port (repository interface) owned by the domain layer.
 * The data layer provides the concrete implementation (AuthRepositoryImpl).
 * The use case depends on this port, never on the HTTP client.
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
}
