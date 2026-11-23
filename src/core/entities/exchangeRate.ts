export interface ExchangeRate {
  cnyToIdr: number;
  notes: string | null;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateExchangeRateCommand {
  cnyToIdr: number;
  notes?: string;
}
