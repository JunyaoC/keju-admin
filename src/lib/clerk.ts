import {Clerk} from '@clerk/clerk-js';

let clerk: Clerk | null = null;

export async function getClerk() {
  if (!clerk) {
    clerk = new Clerk(import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY);
    await clerk.load();
  }
  return clerk;
} 