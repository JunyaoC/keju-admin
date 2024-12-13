<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { $user, signOut } from '@/stores/user';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-vue-next';

const user = useStore($user);
const isLoading = ref(true);

onMounted(() => {
  if (user.value) {
    // console.log('Current User:', user.value);
  }
  // After initial auth check, enable the button
  isLoading.value = false;
});

const handleSignOut = async () => {
  isLoading.value = true;
  await signOut();
  window.location.href = '/login';
};
</script>

<template>
  <Button 
    variant="secondary" 
    @click="handleSignOut" 
    class="gap-2"
    :disabled="isLoading"
  >
    <LogOut class="h-4 w-4" />
    Sign out
  </Button>
</template>