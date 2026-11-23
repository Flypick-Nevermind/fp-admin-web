import type {
  ExchangeRate,
  UpdateExchangeRateCommand,
} from '@/core/entities/exchangeRate';
import type { ExchangeRateRepository } from '@/core/usecases/exchangeRate';
import { ExchangeRateDataSource } from '../datasources/exchangeRate';
import type { ExchangeRateDTO } from '../models/exchangeRate';

function mapDtoToEntity(dto: ExchangeRateDTO): ExchangeRate {
  return {
    cnyToIdr: dto.cny_to_idr,
    notes: dto.notes ?? null,
    updatedAt: dto.updated_at,
    updatedBy: dto.updated_by,
  };
}

export class ExchangeRateRepositoryImpl implements ExchangeRateRepository {
  private readonly source = new ExchangeRateDataSource();

  async getExchangeRate(authorization?: string): Promise<ExchangeRate> {
    const res = await this.source.fetchExchangeRate(authorization);
    return mapDtoToEntity(res.data);
  }

  async updateExchangeRate(
    command: UpdateExchangeRateCommand,
    authorization?: string,
  ): Promise<ExchangeRate> {
    const res = await this.source.updateExchangeRate(
      {
        cny_to_idr: command.cnyToIdr,
        ...(command.notes !== undefined ? { notes: command.notes } : {}),
      },
      authorization,
    );
    return mapDtoToEntity(res.data);
  }
}
