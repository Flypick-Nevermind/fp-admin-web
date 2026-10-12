import type {
  UpdateCartCreationRequestDTO,
  UpdateCartCreationResponseDTO,
  ValidationErrorDetailDTO,
} from '../models/cartCreationUpdate';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the cart-creations/update API.
 *
 * Auth note: this endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header.
 */
export class UpdateCartCreationDataSource {
  /** Stable API path for the update endpoint. */
  private static readonly UPDATE_PATH = '/cart-creations/update';

  private url(): string {
    return `${env.apiBaseUrl}${UpdateCartCreationDataSource.UPDATE_PATH}`;
  }

  /**
   * POST the full update payload. Throws an Error with a human-readable
   * message on any failure (including per-field 422 validation issues).
   */
  async update(
    body: UpdateCartCreationRequestDTO,
    authorization?: string,
  ): Promise<UpdateCartCreationResponseDTO> {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as UpdateCartCreationResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(formatErrors(json.errors, json.message));
    }

    return json;
  }
}

/**
 * The wire `errors` field is either a plain string (400/500) or an array
 * of per-field validation details (422). Flatten both shapes into one
 * readable message for the UI.
 */
function formatErrors(
  errors: string | ValidationErrorDetailDTO[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(errors) && errors.length > 0) {
    return errors
      .map((e) => `${e.field}: ${e.message}`)
      .join(' · ');
  }
  if (typeof errors === 'string' && errors.trim()) return errors;
  return fallback || 'Failed to update cart creation';
}
