import type { JobFormState } from '@/components/jobs/types';

export const createJob = async (jobData: JobFormState) => {
  try {
    const response = await fetch('/api/jobs.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId: string, jobData: JobFormState) => {
  try {
    const response = await fetch(`/api/jobs.json?id=${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...jobData, id: jobId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}; 