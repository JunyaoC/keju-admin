<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import Steps from '@/components/ui/Steps.vue';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import type { JobFormState } from './types';

const props = defineProps<{
  mode?: 'create' | 'edit'
  job?: JobFormState
  currentStep: number
}>();

const formState = ref<JobFormState>({
  title: '',
  category: '',
  description: '',
  responsibilities: [],
  requiredSkills: '',
  location: '',
  isRemote: false,
  startDateTime: '',
  endDateTime: '',
  isFlexibleTiming: false,
  duration: '',
  scheduleDescription: '',
  payRateAmount: 0,
  payRateDescription: '',
  perks: '',
  languages: '',
  dressCode: '',
  additionalRequirements: '',
  visibilityDuration: 'until_filled',
  notifications: {
    newApplication: true,
    messageResponse: false,
    jobExpiry: true
  }
});

const steps = [
  { title: 'Basic Info', isValid: false },
  { title: 'Requirements', isValid: false },
  { title: 'Compensation', isValid: false },
  { title: 'Preview', isValid: true }
];

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean): void
  (e: 'update:currentStep', value: number): void
  (e: 'submit'): void
}>()

// Update validation to use props.currentStep
const isCurrentStepValid = computed(() => {
  switch (props.currentStep) {
    case 0:
      const basicInfoValid = !!formState.value.title && 
             !!formState.value.category && 
             !!formState.value.description &&
             !!formState.value.location && 
             !!formState.value.startDateTime && 
             !!formState.value.endDateTime &&
             formState.value.endDateTime > formState.value.startDateTime;
      return basicInfoValid;
    case 1:
      return true; // Requirements step is optional
    case 2:
      const amount = formState.value.payRateAmount;
      return amount !== undefined && 
             amount !== null && 
             amount > 0 && 
             !!formState.value.payRateDescription;
    case 3:
      return true; // Preview step is always valid
    default:
      return false;
  }
});

const canProceed = computed(() => {
  return isCurrentStepValid.value;
});

const handleNext = () => {
  if (canProceed.value && props.currentStep < steps.length - 1) {
    emit('update:currentStep', props.currentStep + 1);
  }
};

const handlePrevious = () => {
  if (props.currentStep > 0) {
    emit('update:currentStep', props.currentStep - 1);
  }
};

// Watch for validation changes and emit
watch(
  [() => props.currentStep, isCurrentStepValid],
  ([step, isValid]) => {
    emit('update:isValid', isValid);
  },
  { immediate: true }
);

const validateCurrentStep = () => {
  const isValid = isCurrentStepValid.value;
  emit('update:isValid', isValid);
  return isValid;
};

// Modify handleSubmit to emit event
const handleSubmit = async () => {
  try {
    if (isCurrentStepValid.value) {
      emit('submit')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

// Add form validation schema
const formValidation = {
  title: (v: string) => !!v || 'Job title is required',
  category: (v: string) => !!v || 'Category is required',
  description: (v: string) => !!v || 'Description is required',
  location: (v: string) => !!v || 'Location is required',
  startDateTime: (v: string) => !!v || 'Start date/time is required',
  endDateTime: (v: string) => {
    if (!v) return 'End date/time is required';
    if (v <= formState.value.startDateTime) return 'End date/time must be after start date/time';
    return true;
  },
  payRateAmount: (v: number) => {
    if (v === undefined || v === null) return 'Pay rate amount is required';
    if (v <= 0) return 'Pay rate amount must be greater than 0';
    return true;
  },
  payRateDescription: (v: string) => !!v || 'Pay rate description is required (e.g., per hour, per day)',
};

const resetForm = () => {
  formState.value = {
    title: '',
    category: '',
    description: '',
    responsibilities: [],
    requiredSkills: '',
    location: '',
    isRemote: false,
    startDateTime: '',
    endDateTime: '',
    isFlexibleTiming: false,
    duration: '',
    scheduleDescription: '',
    payRateAmount: 0,
    payRateDescription: '',
    perks: '',
    languages: '',
    dressCode: '',
    additionalRequirements: '',
    visibilityDuration: 'until_filled',
    notifications: {
      newApplication: true,
      messageResponse: false,
      jobExpiry: true
    }
  };
  emit('update:currentStep', 0);
};

defineExpose({
  validateCurrentStep,
  formState,
  resetForm
})
</script>

<template>
  <div class="space-y-8">
    <Steps 
      :steps="steps" 
      :current-step="currentStep" 
      class="mb-8"
    />
    
    <Form 
      id="job-form" 
      class="space-y-6" 
      @submit.prevent="handleSubmit"
    >
      <!-- Basic Info Step -->
      <div v-if="currentStep === 0" class="space-y-6">
        <FormField name="title">
          <FormLabel required>Job Title</FormLabel>
          <FormControl>
            <input 
              v-model="formState.title"
              type="text"
              placeholder="e.g., Event Crew Member, Weekend Barista"
              class="w-full"
              required
            />
          </FormControl>
        </FormField>

        <FormField name="category">
          <FormLabel required>Category</FormLabel>
          <FormControl>
            <select v-model="formState.category" class="w-full" required>
              <option value="">Select a category</option>
              <option value="cafe_restaurant">Café/Restaurant</option>
              <option value="retail">Retail</option>
              <option value="event_staffing">Event Staffing</option>
              <option value="delivery">Delivery</option>
              <option value="general_labor">General Labor</option>
              <option value="other">Other</option>
            </select>
          </FormControl>
        </FormField>

        <FormField name="description">
          <FormLabel required>Description</FormLabel>
          <FormControl>
            <textarea
              v-model="formState.description"
              rows="4"
              placeholder="Describe the job role and responsibilities..."
              class="w-full"
              required
            />
          </FormControl>
        </FormField>

        <FormField name="location">
          <FormLabel required>Location</FormLabel>
          <FormControl>
            <input 
              v-model="formState.location"
              type="text"
              placeholder="Enter job location"
              class="w-full"
              required
            />
          </FormControl>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField name="startDateTime">
            <FormLabel required>Start Date/Time</FormLabel>
            <FormControl>
              <input 
                v-model="formState.startDateTime"
                type="datetime-local"
                class="w-full"
                required
              />
            </FormControl>
          </FormField>

          <FormField name="endDateTime">
            <FormLabel required>End Date/Time</FormLabel>
            <FormControl>
              <input 
                v-model="formState.endDateTime"
                type="datetime-local"
                class="w-full"
                required
              />
            </FormControl>
          </FormField>
        </div>

        <FormField name="scheduleDescription">
          <FormLabel>Schedule Description (Optional)</FormLabel>
          <FormControl>
            <textarea 
              v-model="formState.scheduleDescription"
              rows="3"
              placeholder="Add any additional details about the work schedule (e.g., shifts, break times, flexibility)"
              class="w-full"
            />
          </FormControl>
        </FormField>
      </div>

      <!-- Requirements Step -->
      <div v-if="currentStep === 1" class="space-y-6">
        <FormField name="requiredSkills">
          <FormLabel>Required Skills</FormLabel>
          <FormControl>
            <textarea 
              v-model="formState.requiredSkills"
              rows="3"
              placeholder="List required skills (e.g., Customer Service, Cash Handling, Physical Strength)"
              class="w-full"
            />
          </FormControl>
        </FormField>

        <FormField name="languages">
          <FormLabel>Language Requirements (Optional)</FormLabel>
          <FormControl>
            <textarea 
              v-model="formState.languages"
              rows="2"
              placeholder="List required languages (e.g., English, Malay, Mandarin)"
              class="w-full"
            />
          </FormControl>
        </FormField>

        <FormField name="dressCode">
          <FormLabel>Dress Code (Optional)</FormLabel>
          <FormControl>
            <textarea 
              v-model="formState.dressCode"
              rows="2"
              placeholder="Specify dress code requirements (e.g., Black Shirt and Pants, Comfortable Shoes)"
              class="w-full"
            />
          </FormControl>
        </FormField>

        <FormField name="additionalRequirements">
          <FormLabel>Additional Requirements (Optional)</FormLabel>
          <FormControl>
            <textarea
              v-model="formState.additionalRequirements"
              rows="3"
              placeholder="Any other requirements or qualifications needed for this job"
              class="w-full"
            />
          </FormControl>
        </FormField>
      </div>

      <!-- Compensation Step -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <FormField name="payRateAmount">
            <FormLabel required>Pay Rate Amount</FormLabel>
            <FormControl>
              <div class="flex items-center">
                <span class="mr-2 text-muted-foreground">RM</span>
                <input 
                  v-model.number="formState.payRateAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full"
                  required
                />
              </div>
            </FormControl>
          </FormField>

          <FormField name="payRateDescription">
            <FormLabel required>Pay Rate Description</FormLabel>
            <FormControl>
              <input 
                v-model="formState.payRateDescription"
                type="text"
                placeholder="e.g., per hour, per day"
                class="w-full"
                required
              />
            </FormControl>
          </FormField>
        </div>

        <FormField name="perks">
          <FormLabel>Perks & Benefits (Optional)</FormLabel>
          <FormControl>
            <textarea 
              v-model="formState.perks"
              rows="3"
              placeholder="List any perks or benefits (e.g., Meals Provided, Transport Reimbursement, Flexible Hours)"
              class="w-full"
            />
          </FormControl>
        </FormField>

        <FormField name="specialNotes">
          <FormLabel>Special Notes (Optional)</FormLabel>
          <FormControl>
            <textarea
              v-model="formState.specialNotes"
              rows="3"
              placeholder="Any additional information about compensation or benefits..."
              class="w-full"
            />
          </FormControl>
        </FormField>
      </div>

      <!-- Preview Step -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div class="rounded-lg border p-4 space-y-4">
          <h3 class="font-semibold text-lg">{{ formState.title }}</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-muted-foreground">Category</p>
              <p>{{ formState.category }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Location</p>
              <p>{{ formState.location }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Schedule</p>
              <p>{{ formState.startDateTime }} - {{ formState.endDateTime }}</p>
              <p v-if="formState.scheduleDescription" class="mt-1 text-muted-foreground">
                {{ formState.scheduleDescription }}
              </p>
            </div>
            <div>
              <p class="text-muted-foreground">Pay Rate</p>
              <p>RM {{ formState.payRateAmount?.toFixed(2) || '0.00' }} {{ formState.payRateDescription }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <p class="font-medium">Description</p>
            <p>{{ formState.description }}</p>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<style scoped>
.form-field {
  @apply space-y-2;
}

input, select, textarea {
  @apply px-3 py-2 border rounded-md;
}
</style> 