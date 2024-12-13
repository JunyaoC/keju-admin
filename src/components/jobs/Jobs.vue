<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard.vue';
import type { Job } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-vue-next';

// Status options
const statusOptions = [
  { value: 'all', label: 'All Jobs' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'closed', label: 'Closed' }
] as const;

const selectedStatus = ref('all');

// Placeholder data - will come from store later
const jobs = ref<Job[]>([
  {
    id: '1',
    title: 'Weekend Barista',
    category: 'cafe_restaurant',
    location: 'Subang Jaya',
    startDateTime: '2024-03-23T09:00',
    payRateAmount: 15,
    payRateDescription: 'per hour',
    status: 'published',
    stats: {
      views: 45,
      applicants: 12,
      shortlisted: 3
    }
    // ... other required fields
  },
  {
    id: '2',
    title: 'Event Crew',
    category: 'event_staffing',
    location: 'KLCC',
    startDateTime: '2024-03-30T14:00',
    payRateAmount: 180,
    payRateDescription: 'per day',
    status: 'draft',
    stats: {
      views: 23,
      applicants: 5,
      shortlisted: 0
    }
    // ... other required fields
  }
]);

const filteredJobs = computed(() => {
  if (selectedStatus.value === 'all') return jobs.value;
  return jobs.value.filter(job => job.status === selectedStatus.value);
});

const handleStatusChange = (status: string) => {
  selectedStatus.value = status;
};

const handleJobClick = (job: Job) => {
  window.location.href = `/jobs/${job.id}`;
};
</script>

<template>
  <div class="space-y-4 pt-8">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Active Jobs</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" class="gap-2">
            <span>Status: {{ statusOptions.find(s => s.value === selectedStatus)?.label }}</span>
            <ChevronDown class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[200px]">
          <DropdownMenuItem
            v-for="status in statusOptions"
            :key="status.value"
            :disabled="selectedStatus === status.value"
            @click="handleStatusChange(status.value)"
          >
            {{ status.label }}
            <span 
              v-if="selectedStatus === status.value" 
              class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <JobCard 
        v-for="job in filteredJobs" 
        :key="job.id" 
        :job="job"
        @click="handleJobClick"
      />
    </div>
  </div>
</template> 