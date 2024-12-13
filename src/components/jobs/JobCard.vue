<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, Eye, Users } from 'lucide-vue-next';
import type { Job } from './types';

const props = defineProps<{
  job: Job;
}>();

defineEmits<{
  (e: 'click', job: Job): void
}>();

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatPayRate = (amount: number, description: string) => {
  return `RM ${amount.toFixed(2)} ${description}`;
};
</script>

<template>
  <div 
    class="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all cursor-pointer space-y-4"
    @click="$emit('click', job)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-semibold text-lg">{{ job.title }}</h3>
        <p class="text-muted-foreground text-sm">{{ job.category }}</p>
      </div>
      <Badge :variant="job.status === 'published' ? 'default' : 'secondary'">
        {{ job.status }}
      </Badge>
    </div>
    
    <!-- Details -->
    <div class="space-y-2 text-sm text-muted-foreground">
      <div class="flex items-center gap-2">
        <MapPin class="h-4 w-4" />
        <span>{{ job.location }}</span>
        <span v-if="job.isRemote">(Remote)</span>
      </div>
      <div class="flex items-center gap-2">
        <Calendar class="h-4 w-4" />
        <span>{{ formatDateTime(job.startDateTime) }}</span>
      </div>
      <div class="flex items-center gap-2">
        <DollarSign class="h-4 w-4" />
        <span>{{ formatPayRate(job.payRateAmount, job.payRateDescription) }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="pt-4 border-t flex items-center justify-between text-sm">
      <div class="flex items-center gap-1 text-muted-foreground">
        <Eye class="h-4 w-4" />
        <span>{{ job.stats?.views || 0 }}</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1 text-muted-foreground">
          <Users class="h-4 w-4" />
          <span>{{ job.stats?.applicants || 0 }}</span>
        </div>
        <div v-if="job.stats?.shortlisted" class="text-sm text-primary">
          {{ job.stats.shortlisted }} shortlisted
        </div>
      </div>
    </div>
  </div>
</template> 