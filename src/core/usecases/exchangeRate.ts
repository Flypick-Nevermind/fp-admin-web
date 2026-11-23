import type {
  ExchangeRate,
  UpdateExchangeRateCommand,
} from '../entities/exchangeRate';

/** Domain port for reading and updating the CNY -> IDR exchange rate setting. */
export interface ExchangeRateRepository {
  getExchangeRate(authorization?: string): Promise<ExchangeRate>;
  updateExchangeRate(
    command: UpdateExchangeRateCommand,
    authorization?: string,
  ): Promise<ExchangeRate>;
}
