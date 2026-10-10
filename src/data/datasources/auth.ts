import type { AuthLoginRequestDTO, AuthResponseDTO } from '../models/auth';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the auth API.
 * The ONLY layer that knows about fetch / the wire format / the URL.
 * The auth endpoint path is an implementation detail, so it lives here.
 */
export class AuthDataSource {
  /** Stable API path for the admin auth endpoint. */
  private static readonly LOGIN_PATH = '/auth/login';

  /** Build the full login URL from the env base URL + the API path. */
  private loginUrl(): string {
    return `${env.apiBaseUrl}${AuthDataSource.LOGIN_PATH}`;
  }

  async login(body: AuthLoginRequestDTO): Promise<AuthResponseDTO> {
    const res = await fetch(this.loginUrl(), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as AuthResponseDTO;

    // Non-2xx from the backend still carries the standard envelope.
    if (!res.ok || !json.success) {
      throw new AuthApiError(json.errors || json.message || 'Login failed', json.code, json.request_id);
    }

    return json;
  }
}

export class AuthApiError extends Error {
  public readonly code: number;
  public readonly requestId?: string;

  constructor(
    message: string,
    code: number,
    requestId?: string,
  ) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
    this.requestId = requestId;
  }
}
