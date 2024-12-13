<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { computed } from 'vue';

const props = defineProps<{
  modelValue: {
    workSchedule: string;
    startDate: string;
    endDate: string;
    requiredSkills: string[];
    languages: string[];
    ageRequirement: string;
    dressCode: string;
  }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>();

// Helper for array-to-string conversion
const requiredSkillsString = computed({
  get: () => props.modelValue.requiredSkills.join(', '),
  set: (value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      requiredSkills: value.split(',').map(s => s.trim()).filter(s => s),
    });
  }
});

const languagesString = computed({
  get: () => props.modelValue.languages.join(', '),
  set: (value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      languages: value.split(',').map(l => l.trim()).filter(l => l),
    });
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Work Schedule -->
    <div class="space-y-2">
      <Label>Work Schedule Description *</Label>
      <Textarea
        v-model="modelValue.workSchedule"
        required
        :rows="3"
        placeholder="Describe the work schedule in detail..."
      />
    </div>

    <!-- Job Period -->
    <div class="space-y-2">
      <Label>Job Period *</Label>
      <div class="grid gap-2">
        <div class="flex items-center gap-2">
          <Label class="w-24">Start Date</Label>
          <Input 
            type="datetime-local"
            v-model="modelValue.startDate"
            required 
          />
        </div>
        <div class="flex items-center gap-2">
          <Label class="w-24">End Date</Label>
          <Input 
            type="datetime-local"
            v-model="modelValue.endDate"
            required 
          />
        </div>
      </div>
    </div>

    <!-- Skills and Requirements -->
    <div class="space-y-4">
      <div class="space-y-2">
        <Label>Required Skills</Label>
        <Input 
          v-model="requiredSkillsString"
          placeholder="Separate skills with commas" 
        />
      </div>

      <div class="space-y-2">
        <Label>Languages</Label>
        <Input 
          v-model="languagesString"
          placeholder="English, Malay, etc." 
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label>Age Requirement</Label>
          <Input 
            v-model="modelValue.ageRequirement"
            placeholder="e.g., 18+ only" 
          />
        </div>

        <div class="space-y-2">
          <Label>Dress Code</Label>
          <Input 
            v-model="modelValue.dressCode"
            placeholder="e.g., Smart casual, Black shirt and pants" 
          />
        </div>
      </div>
    </div>
  </div>
</template> 