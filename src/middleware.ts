import { defineMiddleware } from 'astro:middleware'
import { createClerkClient } from '@clerk/backend'
import { db } from '@/lib/db'

const publicPages = ['/login', '/access-denied']

// Add type for Locals
interface Locals {
  auth?: {
    userId: string;
    isProfileComplete: boolean;
  };
  user?: any; // Replace with your user type
}

// Cache auth results in memory (optional)
const authCache = new Map<string, {timestamp: number, data: any}>();
const CACHE_TTL = 60 * 1000; // 1 minute

export const onRequest = defineMiddleware(async ({ locals, request, redirect }, next) => {
  const url = new URL(request.url)
  
  // Skip auth check for public pages
  if (publicPages.includes(url.pathname)) {
    // Initialize auth even for public pages
    locals.auth = {
      userId: '',
      isProfileComplete: false
    }
    return next()
  }

  try {
    const clerkClient = createClerkClient({
      secretKey: import.meta.env.CLERK_SECRET_KEY,
      publishableKey: import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
      jwtKey: import.meta.env.PUBLIC_CLERK_JWT_KEY,
    })

    const result = await clerkClient.authenticateRequest(request)
    
    if (!result.isSignedIn) {
      return redirect('/login')
    }

    const auth = result.toAuth()
    const clerkUser = await clerkClient.users.getUser(auth.userId)
    const metadata = clerkUser.publicMetadata

    // Initialize auth object with proper values
    locals.auth = {
      userId: clerkUser.id,
      isProfileComplete: metadata.is_profile_complete || false
    }

    // If user is not an employer, redirect
    if (!metadata.is_employer) {
      await clerkClient.sessions.revokeSession(auth.sessionId)
      return redirect('/access-denied')
    }

    // Try to get cached user data
    const cacheKey = auth.userId
    const cachedData = authCache.get(cacheKey)
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      locals.user = cachedData.data
      return next()
    }

    // Only query necessary fields from DB
    const user = await db.user.upsert({
      where: { id: clerkUser.id },
      update: {},  // Don't update anything
      create: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: metadata.name || clerkUser.firstName || '',
        role: 'EMPLOYER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    // Cache the result
    authCache.set(cacheKey, {
      timestamp: Date.now(),
      data: user
    })

    locals.user = user
    return next()
  } catch (error) {
    console.error('Authentication error:', error)
    return redirect('/login')
  }
})