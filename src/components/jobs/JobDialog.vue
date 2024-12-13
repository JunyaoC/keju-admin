<script setup lang="ts">
import { ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import JobForm from './JobForm.vue';
import type { Job } from './types';

const props = defineProps<{
  isOpen: boolean;
  mode: 'create' | 'edit';
  job?: Job;
}>();

const emit = defineEmits<{
  (e: 'update:is-open', value: boolean): void;
  (e: 'submit'): void;
}>();

const formRef = ref<InstanceType<typeof JobForm> | null>(null);
const currentStep = ref(0);
const isValid = ref(false);

const handleValidationUpdate = (value: boolean) => {
  isValid.value = value;
};

const handleSubmit = async () => {
  try {
    emit('submit');
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const handleOpenChange = (open: boolean) => {
  emit('update:is-open', open);
  if (!open) {
    currentStep.value = 0;
  }
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{{ mode === 'create' ? 'Create New Job' : 'Edit Job' }}</DialogTitle>
      </DialogHeader>

      <div class="py-4">
        <JobForm
          ref="formRef"
          :mode="mode"
          :job="job"
          :current-step="currentStep"
          @update:current-step="currentStep = $event"
          @update:is-valid="handleValidationUpdate"
          @submit="handleSubmit"
        />
      </div>

      <div class="flex justify-between mt-4">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          :disabled="currentStep === 0"
          @click="currentStep--"
        >
          Previous
        </button>
        <button
          v-if="currentStep < 3"
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          :disabled="!isValid"
          @click="currentStep++"
        >
          Next
        </button>
        <button
          v-else
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Submit
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>