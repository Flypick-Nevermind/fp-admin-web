import type {
  ActivityItem,
  DashboardStat,
} from '@/core/entities/admin';

/**
 * Port (repository interface) owned by the domain layer.
 * The data layer provides the concrete implementation (DashboardRepositoryImpl).
 * Usecases depend on this port, never on the implementation.
 */
export interface DashboardRepository {
  getStats(): Promise<DashboardStat[]>;
  getActivity(): Promise<ActivityItem[]>;
}
