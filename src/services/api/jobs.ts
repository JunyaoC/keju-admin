import type { Job, JobFormState } from '@/components/jobs/types';

export const JobsAPI = {
  async getJobs(params?: Record<string, any>): Promise<Job[]> {
    // TODO: Implement API call
    return [];
  },

  async getJob(id: string): Promise<Job> {
    // TODO: Implement API call
    return {} as Job;
  },

  async createJob(data: JobFormState): Promise<Job> {
    // TODO: Implement API call
    return {} as Job;
  },

  async updateJob(id: string, data: Partial<JobFormState>): Promise<Job> {
    // TODO: Implement API call
    return {} as Job;
  },

  async deleteJob(id: string): Promise<void> {
    // TODO: Implement API call
  }
}; 