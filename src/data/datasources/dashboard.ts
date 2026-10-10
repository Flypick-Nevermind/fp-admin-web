import type { DashboardStatDTO, ActivityItemDTO } from '@/data/models/dashboard';

/**
 * Raw data source — in a real app this would be an HTTP API client.
 * Kept isolated so the rest of the architecture never couples to fetch/axios.
 */
export class DashboardDataSource {
  async fetchStats(): Promise<DashboardStatDTO[]> {
    // simulate async fetch
    return [
      { id: 's1', title: 'Total Users', value: 12846, delta: 8.2 },
      { id: 's2', title: 'Active Sessions', value: 1392, delta: 3.1 },
      { id: 's3', title: 'Orders (30d)', value: 4210, delta: -1.4 },
      { id: 's4', title: 'Revenue (30d)', value: 86400, delta: 12.5 },
    ];
  }

  async fetchActivity(): Promise<ActivityItemDTO[]> {
    return [
      { id: 'a1', actor: 'Admin', action: 'Updated user role for jane@corp.com', timestamp: '2 min ago' },
      { id: 'a2', actor: 'System', action: 'Auto-suspended inactive account', timestamp: '1 hr ago' },
      { id: 'a3', actor: 'Editor', action: 'Published new article draft', timestamp: '3 hrs ago' },
      { id: 'a4', actor: 'Owner', action: 'Changed billing plan to Enterprise', timestamp: 'Yesterday' },
    ];
  }
}
