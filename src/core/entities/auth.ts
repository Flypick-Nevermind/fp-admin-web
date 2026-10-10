/**
 * Auth domain entities (plain types, no dependencies).
 */

export interface LoginCredentials {
  userEmail: string;
  userPassword: string;
}

export interface AuthSession {
  accessToken: string;
  userId: string;
  userName: string;
}
