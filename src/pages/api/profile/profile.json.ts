import type { APIRoute } from 'astro';
import { createClerkClient } from '@clerk/backend';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const employer = await db.employer.findUnique({
      where: {
        userId: locals.user.id
      },
      include: {
        business: true,
        user: true
      }
    });

    return new Response(JSON.stringify({
      success: true,
      data: employer
    }), {
      status: 200,
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch profile' 
    }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const data = await request.json();
    
    console.log('Received data:', data.contactPerson.name);
    
    // // Simple name validation
    // const trimmedName = data.contactPerson?.name;
    // if (!trimmedName) {
    //   return new Response(JSON.stringify({ 
    //     success: false,
    //     error: 'Name is required' 
    //   }), {
    //     status: 400,
    //   });
    // }

    // Create or update business and employer in a transaction
    const result = await db.$transaction(async (tx) => {
      // First, ensure user exists in our database
      const user = await tx.user.upsert({
        where: {
          id: locals.user.id
        },
        update: {
          name: data.contactPerson.name,
          email: locals.user.email,
          role: 'EMPLOYER'
        },
        create: {
          id: locals.user.id,
          name: data.contactPerson.name,
          email: locals.user.email,
          role: 'EMPLOYER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });

      // Create or update business
      const business = await tx.business.upsert({
        where: {
          id: data.businessId || 'new',
        },
        update: {
          name: data.businessName?.trim() || '',
          address: data.businessAddress?.trim() || '',
          description: data.businessDescription || '',
          logo: data.businessLogo || null,
          isComplete: true,
        },
        create: {
          name: data.businessName?.trim() || '',
          address: data.businessAddress?.trim() || '',
          description: data.businessDescription || '',
          logo: data.businessLogo || null,
          isComplete: true,
        },
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          logo: true,
          isComplete: true
        }
      });

      // Create or update employer
      const employer = await tx.employer.upsert({
        where: {
          userId: locals.user.id,
        },
        update: {
          role: data.contactPerson.role,
          department: data.contactPerson.department,
          businessId: business.id,
        },
        create: {
          userId: locals.user.id,
          role: data.contactPerson.role,
          department: data.contactPerson.department,
          businessId: business.id,
        },
        select: {
          id: true,
          role: true,
          department: true,
          userId: true,
          businessId: true
        }
      });

      return {
        success: true,
        data: {
          user,
          business,
          employer
        }
      };
    });

    // Log the result for debugging
    console.log('Transaction result:', result.data.user);

    // Update Clerk metadata
    const clerk = createClerkClient({
      secretKey: import.meta.env.CLERK_SECRET_KEY
    });

    const clerkUser = await clerk.users.getUser(locals.user.id);
    
    await clerk.users.updateUser(locals.user.id, {
      publicMetadata: {
        ...(clerkUser.publicMetadata || {}),
        is_profile_complete: true,
        businessId: result.data.business.id,
        businessName: data.businessName?.trim(),
        name: data.contactPerson.name,
        role: data.contactPerson.role
      }
    });

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database error', 
        code: error.code,
        meta: error.meta
      }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to save profile' 
    }), {
      status: 500,
    });
  }
}; 