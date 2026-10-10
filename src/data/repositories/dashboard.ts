import type { DashboardRepository } from '@/core/usecases/dashboard';
import { DashboardDataSource } from '@/data/datasources/dashboard';
import type { DashboardStat, ActivityItem } from '@/core/entities/admin';

export class DashboardRepositoryImpl implements DashboardRepository {
  private source: DashboardDataSource;

  constructor() {
    this.source = new DashboardDataSource();
  }

  async getStats(): Promise<DashboardStat[]> {
    const dtos = await this.source.fetchStats();
    return dtos.map((d) => ({
      id: d.id,
      title: d.title,
      value: fmt(d.value),
      delta: (d.delta >= 0 ? '+' : '') + d.delta.toFixed(1) + '%',
      deltaPositive: d.delta >= 0,
    }));
  }

  async getActivity(): Promise<ActivityItem[]> {
    const dtos = await this.source.fetchActivity();
    return dtos.map((d) => ({ ...d }));
  }
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}
