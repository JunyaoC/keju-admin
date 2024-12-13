import { atom } from 'nanostores';
import type { User } from '@clerk/clerk-js';

export const $user = atom<User | null>(null);

// Helper functions to manage user state
export async function initializeUser() {
  const clerk = window.Clerk;
  if (!clerk) return;

  // Wait for auth to be ready
  await clerk.load({
    afterSignIn: (session) => {
      console.log('Signed in!', session);
    }
  });

  $user.set(clerk.user);
  
  // Log initial user state
  console.log('Initial User State:', {
    id: clerk.user?.id,
    email: clerk.user?.primaryEmailAddress?.emailAddress,
    fullName: clerk.user?.fullName,
    metadata: clerk.user?.publicMetadata,
  });

  // Listen for changes
  clerk.addListener(({ user }) => {
    $user.set(user);
    // Log user state changes
    console.log('User State Changed:', {
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      fullName: user?.fullName,
      metadata: user?.publicMetadata,
    });
  });
}

export async function signOut() {
  const clerk = window.Clerk;
  if (!clerk) return;
  
  await clerk.signOut();
  $user.set(null);
} 