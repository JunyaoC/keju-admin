import type { APIRoute } from 'astro'
import { db } from '@/lib/db'

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Find user with employer and business data
    const dbUser = await db.user.findUnique({
      where: { 
        id: locals.user.id 
      },
      include: {
        employer: {
          include: {
            business: true
          }
        }
      }
    });

    if (!dbUser) {
      return new Response(JSON.stringify({ 
        exists: false,
        complete: false,
        redirect: '/profile'
      }));
    }

    const isComplete = dbUser.employer?.business?.isComplete ?? false;

    return new Response(JSON.stringify({
      exists: true,
      complete: isComplete,
      redirect: isComplete ? null : '/profile',
      profile: {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
        },
        business: dbUser.employer?.business,
        employer: dbUser.employer
      }
    }));

  } catch (error) {
    console.error('Profile check error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500 
    });
  }
}; 