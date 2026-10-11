import type { AuthRepository } from '@/core/usecases/auth';
import type { AuthSession, LoginCredentials } from '@/core/entities/auth';
import { AuthDataSource } from '@/data/datasources/auth';

/**
 * Concrete data-layer implementation of the AuthRepository port.
 * Maps the wire DTO (snake_case) into the domain entity (camelCase).
 */
export class AuthRepositoryImpl implements AuthRepository {
  private source: AuthDataSource;

  constructor() {
    this.source = new AuthDataSource();
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await this.source.login({
      user_email: credentials.userEmail,
      user_password: credentials.userPassword,
    });

    return {
      accessToken: response.data.access_token,
      adminId: response.data.user_admin_id,
      userName: response.data.user_name,
    };
  }
}
