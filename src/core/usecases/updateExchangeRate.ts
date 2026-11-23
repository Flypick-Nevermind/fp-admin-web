import type {
  ExchangeRate,
  UpdateExchangeRateCommand,
} from '../entities/exchangeRate';
import type { ExchangeRateRepository } from './exchangeRate';

export class UpdateExchangeRateUseCase {
  private readonly repo: ExchangeRateRepository;

  constructor(repo: ExchangeRateRepository) {
    this.repo = repo;
  }

  execute(
    command: UpdateExchangeRateCommand,
    authorization?: string,
  ): Promise<ExchangeRate> {
    return this.repo.updateExchangeRate(command, authorization);
  }
}
