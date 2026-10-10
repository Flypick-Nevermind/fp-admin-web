import type { AuthRepository } from './auth';
import type { AuthSession, LoginCredentials } from '../entities/auth';

/**
 * Application use case: perform a login.
 * Depends only on the AuthRepository port (domain) — stays decoupled from
 * any concrete HTTP client or data-layer class.
 */
export class Login {
  private readonly repo: AuthRepository;

  constructor(repo: AuthRepository) {
    this.repo = repo;
  }

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await this.repo.login(credentials);
    // Basic integrity guard: reject a session without a token.
    if (!session.accessToken) {
      throw new Error('No access token in response');
    }
    return session;
  }
}
