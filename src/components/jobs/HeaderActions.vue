<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import JobDialog from './JobDialog.vue';

const isDialogOpen = ref(false);

const handleCreateJob = () => {
  isDialogOpen.value = true;
};
</script>

<template>
  <div>
    <Button @click="handleCreateJob">Create New Job</Button>
    <JobDialog
      v-model:is-open="isDialogOpen"
      mode="create"
    />
  </div>
</template> 