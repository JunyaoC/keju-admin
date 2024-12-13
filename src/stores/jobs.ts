import { atom, map } from 'nanostores';
import type { Job } from '@/components/jobs/types';

// Store for jobs list
export const $jobs = atom<Job[]>([]);

// Store for selected job
export const $selectedJob = atom<Job | null>(null);

// Store for job filters and pagination
export const $jobFilters = map({
  search: '',
  category: '',
  status: '',
  page: 1,
  limit: 10
});

// Store for loading states
export const $jobsLoading = map({
  list: false,
  details: false,
  create: false,
  update: false,
  delete: false
}); 