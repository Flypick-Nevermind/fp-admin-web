import { useEffect, useState } from 'react';
import type { DashboardStat } from '@/core/entities/admin';
import { GetDashboardStats } from '@/core/usecases/getDashboard';
import { DashboardRepositoryImpl } from '@/data/repositories/dashboard';
import type { DashboardRepository } from '@/core/usecases/dashboard';

/**
 * Presentation-layer hook + composition root.
 * This is the ONLY place where the domain port is wired to the
 * concrete data-layer repository. The usecase stays decoupled.
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo: DashboardRepository = new DashboardRepositoryImpl();
    const useCase = new GetDashboardStats(repo);
    let active = true;

    useCase
      .execute()
      .then((s) => active && setStats(s))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { stats, loading };
}
