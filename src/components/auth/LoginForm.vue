<script setup lang="ts">
import { onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// We'll initialize Clerk on mount
onMounted(async () => {
  // Wait for Clerk to be ready
  while (!window.Clerk) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  // Mount sign-in component to our container
  const signInDiv = document.getElementById('sign-in');
  if (signInDiv) {
    await window.Clerk.mountSignIn(signInDiv, {
      afterSignInUrl: '/',
      signUpUrl: '/signup',
    });
  }
});
</script>

<template>
  <div id="sign-in"></div>
</template>
