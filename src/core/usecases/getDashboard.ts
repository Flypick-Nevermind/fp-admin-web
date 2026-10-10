import type { DashboardRepository } from '@/core/usecases/dashboard';
import type { DashboardStat } from '@/core/entities/admin';

/**
 * Application use case: orchestrates the dashboard data.
 * Depends only on the DashboardRepository port (domain), not on any
 * concrete data-layer class — this keeps the domain decoupled.
 */
export class GetDashboardStats {
  private readonly repo: DashboardRepository;

  constructor(repo: DashboardRepository) {
    this.repo = repo;
  }

  async execute(): Promise<DashboardStat[]> {
    return this.repo.getStats();
  }
}
