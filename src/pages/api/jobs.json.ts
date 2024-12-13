import type { APIRoute } from 'astro';
import type { JobFormState, Job } from '@/components/jobs/types';

// This would be replaced with your actual database operations
let jobs: Job[] = [];

export const GET: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify(jobs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const jobData = await request.json() as JobFormState;
    
    // Add created timestamp and ID
    const newJob: Job = {
      ...jobData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    jobs.push(newJob);
    
    return new Response(JSON.stringify(newJob), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to create job',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      throw new Error('Job ID is required');
    }

    const jobData = await request.json() as JobFormState;
    const index = jobs.findIndex(j => j.id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Job not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    jobs[index] = { 
      ...jobs[index], 
      ...jobData,
      updatedAt: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(jobs[index]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to update job',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      throw new Error('Job ID is required');
    }
    
    jobs = jobs.filter(job => job.id !== id);
    
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to delete job',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 