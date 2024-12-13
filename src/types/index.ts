export type JobCategory = typeof JOB_CATEGORIES[number]['id'];
export type JobStatus = typeof JOB_STATUSES[number]['id'];
export type PayRateType = typeof PAY_RATE_TYPES[number]['id'];

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationParams;
  };
} 