<script setup lang="ts">
import { Button } from "@/components/ui/button";

interface Props {
  data: {
    title: string;
    category: string;
    location: string;
    isRemote: boolean;
    description: string;
    workSchedule: string;
    startDate: string;
    endDate: string;
    requiredSkills: string[];
    languages: string[];
    ageRequirement: string;
    dressCode: string;
    payRate: string;
    perks: string[];
    benefits: string;
  }
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-2xl font-bold">{{ data.title }}</h1>
      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <span>{{ data.category }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>{{ data.location }}</span>
          <span v-if="data.isRemote">(Remote available)</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="prose prose-sm max-w-none">
      <h2 class="text-lg font-semibold">Job Description</h2>
      <p>{{ data.description }}</p>
    </div>

    <!-- Requirements -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Requirements & Schedule</h2>
      
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <h3 class="font-medium">Work Schedule</h3>
          <p class="text-sm">{{ data.workSchedule }}</p>
          <p class="text-sm text-muted-foreground">
            {{ new Date(data.startDate).toLocaleDateString() }} - 
            {{ new Date(data.endDate).toLocaleDateString() }}
          </p>
        </div>

        <div v-if="data.requiredSkills.length" class="space-y-2">
          <h3 class="font-medium">Required Skills</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="skill in data.requiredSkills" 
              :key="skill"
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div v-if="data.languages.length" class="space-y-2">
          <h3 class="font-medium">Languages</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="lang in data.languages" 
              :key="lang"
              class="text-sm text-muted-foreground"
            >
              {{ lang }}
            </span>
          </div>
        </div>

        <div v-if="data.ageRequirement || data.dressCode" class="space-y-2">
          <h3 class="font-medium">Additional Requirements</h3>
          <p v-if="data.ageRequirement" class="text-sm">Age: {{ data.ageRequirement }}</p>
          <p v-if="data.dressCode" class="text-sm">Dress Code: {{ data.dressCode }}</p>
        </div>
      </div>
    </div>

    <!-- Compensation -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Compensation & Benefits</h2>
      
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <h3 class="font-medium">Pay Rate</h3>
          <p class="text-lg font-semibold">{{ data.payRate }}</p>
        </div>

        <div v-if="data.perks.length" class="space-y-2">
          <h3 class="font-medium">Perks & Benefits</h3>
          <ul class="text-sm space-y-1">
            <li 
              v-for="perk in data.perks" 
              :key="perk"
              class="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ perk }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="data.benefits" class="prose prose-sm max-w-none">
        {{ data.benefits }}
      </div>
    </div>
  </div>
</template> 