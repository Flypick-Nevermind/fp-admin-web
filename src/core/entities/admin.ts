export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  trend: number; // percentage change
  unit?: string;
}

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export const ADMIN_ROLES = ['owner', 'admin', 'editor', 'viewer'] as const;
