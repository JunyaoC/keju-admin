import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import type { JobFormState } from '@/components/jobs/types';
import { JobsAPI } from '@/services/api/jobs';

export function useJobForm(mode: 'create' | 'edit' = 'create') {
  const isLoading = ref(false);
  const currentStep = ref(0);

  const initialValues: JobFormState = {
    // ... initial form values
  };

  const { handleSubmit, resetForm, values } = useForm({
    initialValues
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      isLoading.value = true;
      if (mode === 'create') {
        await JobsAPI.createJob(values);
      } else {
        // Handle edit
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      isLoading.value = false;
    }
  });

  return {
    isLoading,
    currentStep,
    handleSubmit: onSubmit,
    resetForm,
    formValues: values
  };
} 