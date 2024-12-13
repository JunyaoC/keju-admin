<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { computed } from "vue";

const props = defineProps<{
  modelValue: {
    payRate: string;
    perks: string[];
    benefits: string;
  }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>();

// Helper for array-to-string conversion
const perksString = computed({
  get: () => props.modelValue.perks.join(', '),
  set: (value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      perks: value.split(',').map(p => p.trim()).filter(p => p),
    });
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Pay Rate -->
    <div class="space-y-2">
      <Label>Pay Rate *</Label>
      <Input
        v-model="modelValue.payRate"
        required
        placeholder="e.g., RM 15/hour, RM 120/day, or Negotiable"
      />
      <p class="text-sm text-muted-foreground">
        Be clear about the payment structure (hourly, daily, or project-based)
      </p>
    </div>

    <!-- Perks -->
    <div class="space-y-2">
      <Label>Perks & Incentives</Label>
      <Input
        v-model="perksString"
        placeholder="e.g., Meals provided, Transport allowance, Performance bonus"
      />
      <p class="text-sm text-muted-foreground">
        Separate multiple perks with commas
      </p>
    </div>

    <!-- Additional Benefits -->
    <div class="space-y-2">
      <Label>Additional Benefits & Information</Label>
      <Textarea
        v-model="modelValue.benefits"
        :rows="4"
        placeholder="Describe any additional benefits, growth opportunities, or important information about the compensation package."
      />
    </div>
  </div>
</template> 