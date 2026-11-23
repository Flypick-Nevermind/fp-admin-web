import type {
  ExchangeRateResponseDTO,
  UpdateExchangeRateRequestDTO,
} from '../models/exchangeRate';
import type { ValidationErrorDetailDTO } from '../models/cartCreationUpdate';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for `/settings/exchange-rate`.
 *
 * Auth note: both GET and PUT sit under `/api-admin/v1/settings/exchange-rate`
 * behind the admin JWT, so callers supply the `Authorization` header.
 */
export class ExchangeRateDataSource {
  private static readonly EXCHANGE_RATE_PATH = '/settings/exchange-rate';

  private url(): string {
    return `${env.apiBaseUrl}${ExchangeRateDataSource.EXCHANGE_RATE_PATH}`;
  }

  async fetchExchangeRate(
    authorization?: string,
  ): Promise<ExchangeRateResponseDTO> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(), { method: 'GET', headers });
    const json = (await res.json()) as ExchangeRateResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(
        formatErrors(json.errors, json.message, 'Failed to load exchange rate'),
      );
    }

    return json;
  }

  async updateExchangeRate(
    body: UpdateExchangeRateRequestDTO,
    authorization?: string,
  ): Promise<ExchangeRateResponseDTO> {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.url(), {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as ExchangeRateResponseDTO;

    if (!res.ok || !json.success) {
      throw new Error(
        formatErrors(json.errors, json.message, 'Failed to update exchange rate'),
      );
    }

    return json;
  }
}

function formatErrors(
  errors: string | ValidationErrorDetailDTO[] | undefined,
  fallback: string,
  defaultMessage: string,
): string {
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.map((e) => `${e.field}: ${e.message}`).join(' · ');
  }
  if (typeof errors === 'string' && errors.trim()) return errors;
  return fallback || defaultMessage;
}
