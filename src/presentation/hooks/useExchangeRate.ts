import { useCallback, useEffect, useState } from 'react';
import type {
  ExchangeRate,
  UpdateExchangeRateCommand,
} from '@/core/entities/exchangeRate';
import { GetExchangeRateUseCase } from '@/core/usecases/getExchangeRate';
import { UpdateExchangeRateUseCase } from '@/core/usecases/updateExchangeRate';
import { ExchangeRateRepositoryImpl } from '@/data/repositories/exchangeRate';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for reading & updating the
 * CNY -> IDR exchange rate setting.
 */
export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repo = new ExchangeRateRepositoryImpl();
      const useCase = new GetExchangeRateUseCase(repo);
      const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;
      const data = await useCase.execute(auth);
      setExchangeRate(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to load exchange rate.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const repo = new ExchangeRateRepositoryImpl();
    const useCase = new GetExchangeRateUseCase(repo);
    const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;

    useCase
      .execute(auth)
      .then((data) => {
        if (active) setExchangeRate(data);
      })
      .catch((e) => {
        if (active) {
          setError(
            e instanceof Error ? e.message : 'Failed to load exchange rate.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(
    async (command: UpdateExchangeRateCommand): Promise<ExchangeRate> => {
      setSaving(true);
      try {
        const repo = new ExchangeRateRepositoryImpl();
        const useCase = new UpdateExchangeRateUseCase(repo);
        const auth = getAccessToken()
          ? `Bearer ${getAccessToken()}`
          : undefined;
        const updated = await useCase.execute(command, auth);
        setExchangeRate(updated);
        return updated;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { exchangeRate, loading, error, saving, reload: load, update };
}
