import type { ExchangeRate } from '../entities/exchangeRate';
import type { ExchangeRateRepository } from './exchangeRate';

export class GetExchangeRateUseCase {
  private readonly repo: ExchangeRateRepository;

  constructor(repo: ExchangeRateRepository) {
    this.repo = repo;
  }

  execute(authorization?: string): Promise<ExchangeRate> {
    return this.repo.getExchangeRate(authorization);
  }
}
