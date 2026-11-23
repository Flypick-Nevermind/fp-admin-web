import type { ValidationErrorDetailDTO } from './cartCreationUpdate';

export interface ExchangeRateDTO {
  cny_to_idr: number;
  notes?: string | null;
  updated_at: string;
  updated_by: string;
}

export interface ExchangeRateResponseDTO {
  success: boolean;
  message: string;
  data: ExchangeRateDTO;
  errors?: string | ValidationErrorDetailDTO[];
}

export interface UpdateExchangeRateRequestDTO {
  cny_to_idr: number;
  notes?: string;
}
