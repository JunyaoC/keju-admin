<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { $user, signOut } from '@/stores/user';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-vue-next';

const user = useStore($user);

const handleSignOut = async () => {
  await signOut();
  window.location.href = '/login';
};
</script>

<template>
  <div v-if="user" class="fixed bottom-4 right-4">
    <Button variant="destructive" @click="handleSignOut" class="gap-2">
      <LogOut class="h-4 w-4" />
      Sign Out
    </Button>
  </div>
</template> 