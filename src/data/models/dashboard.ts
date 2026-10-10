// Raw DTOs coming from an API / data source
export interface DashboardStatDTO {
  id: string;
  title: string;
  value: number;
  delta: number;
}

export interface ActivityItemDTO {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}
