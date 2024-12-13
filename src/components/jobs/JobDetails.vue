<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@nanostores/vue';
import { $applications, $selectedApplication, $applicationFilters } from '@/stores/applications';
import { formatDateTime, formatPayRate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import JobDialog from './JobDialog.vue';
import type { Job } from './types';
import { FileDown, Filter, MoreHorizontal, MessageSquare, User, Check, X, Image } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
  jobId: string;
}>();

// Placeholder data - in real app, fetch from API
const job = ref<Job>({
  id: props.jobId,
  title: 'Weekend Barista',
  category: 'cafe_restaurant',
  description: 'Looking for an experienced barista for weekend shifts...',
  responsibilities: ['Make coffee', 'Customer service'],
  location: 'Subang Jaya',
  isRemote: false,
  startDateTime: '2024-03-23T09:00',
  endDateTime: '2024-03-24T18:00',
  isFlexibleTiming: true,
  duration: '2 days',
  scheduleDescription: 'Weekend shifts, 9 AM to 6 PM',
  payRateAmount: 15,
  payRateDescription: 'per hour',
  perks: 'Meals provided, training provided',
  requiredSkills: 'Barista experience, customer service',
  languages: 'English, Malay',
  dressCode: 'Black shirt and pants',
  additionalRequirements: '',
  visibilityDuration: 'until_filled',
  createdAt: '2024-03-15T08:00:00Z',
  updatedAt: '2024-03-15T08:00:00Z',
  status: 'published',
  notifications: {
    newApplication: true,
    messageResponse: true,
    jobExpiry: true
  }
});

const isDialogOpen = ref(false);
const expandedSections = ref<string[]>(['details']);

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatPayRate = (amount: number, description: string) => {
  return `$${amount}${description ? ' ' + description : ''}`;
};

const formatCategory = (category: string) => {
  const categoryMap: Record<string, string> = {
    'cafe_restaurant': 'Café/Restaurant',
    // Add other categories as needed
  };
  return categoryMap[category] || category;
};

const handleEditJob = () => {
  isDialogOpen.value = true;
};

const handleDialogSubmit = () => {
  // In real app, refresh job data
  isDialogOpen.value = false;
};

const toggleSection = (section: string) => {
  const index = expandedSections.value.indexOf(section);
  if (index === -1) {
    expandedSections.value.push(section);
  } else {
    expandedSections.value.splice(index, 1);
  }
};

const isSectionExpanded = (section: string) => {
  return expandedSections.value.includes(section);
};

const applications = useStore($applications);
const selectedApplication = useStore($selectedApplication);

type ApplicantStatus = 'pending' | 'shortlisted' | 'rejected' | 'accepted';

const getStatusBadgeVariant = (status: ApplicantStatus) => {
  const variants: Record<ApplicantStatus, 'default' | 'secondary' | 'destructive' | 'success'> = {
    pending: 'secondary',
    shortlisted: 'default',
    rejected: 'destructive',
    accepted: 'success'
  };
  return variants[status] || 'secondary';
};

const selectedApplicant = ref<typeof applications[0] | null>(null);
const isDetailsDialogOpen = ref(false);

const handleStatusChange = (newStatus: 'published' | 'draft' | 'closed') => {
  // TODO: Implement API call to update job status
  props.job.status = newStatus;
};

const handleApplicantAction = (action: string, applicant: typeof applications[0]) => {
  switch (action) {
    case 'status':
      // Status changes are handled by handleStatusChange
      break;
    case 'chat':
      // Navigate to chat page with applicant ID
      window.location.href = `/admin/chat?applicant=${applicant.id}`;
      break;
    case 'view':
      selectedApplicant.value = applicant;
      isDetailsDialogOpen.value = true;
      break;
  }
};

const handleApplicantStatusChange = (applicant: typeof applications[0], newStatus: ApplicantStatus) => {
  // TODO: Implement API call to update applicant status
  applicant.status = newStatus;
};

const handleRowClick = (applicant: Applicant) => {
  $selectedApplication.set(applicant);
  isDetailsDialogOpen.value = true;
};

const handleBack = () => {
  window.location.href = `/`;
};

const handleViewJob = (job: Job) => {
  window.location.href = `/jobs/${job.id}`;
};
</script>

<template>
  <div class="container py-6 space-y-6">
    <!-- Header -->
    <div class="space-y-6">
      <!-- Top Navigation -->
      <div class="flex items-center justify-between">
        <Button variant="outline" as="a" href="/">← Back to Jobs</Button>
        <div class="flex items-center gap-2">
          <!-- Status Toggle -->
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status: {{ job.status }}
                <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="handleStatusChange('published')">
                Published
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleStatusChange('draft')">
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleStatusChange('closed')">
                Closed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" @click="handleEditJob">Edit Job</Button>
          <Button variant="destructive">Delete Job</Button>
        </div>
      </div>

      <!-- Job Header Info -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 border-b">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h1 class="text-3xl font-bold">{{ job.title }}</h1>
            <Badge :variant="job.status === 'published' ? 'default' : 'secondary'">
              {{ job.status }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- Stats/Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-lg border bg-card">
          <p class="text-sm text-muted-foreground">Views</p>
          <p class="text-2xl font-bold">0</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <p class="text-sm text-muted-foreground">Applications</p>
          <p class="text-2xl font-bold">0</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <p class="text-sm text-muted-foreground">Shortlisted</p>
          <p class="text-2xl font-bold">0</p>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <p class="text-sm text-muted-foreground">Days Active</p>
          <p class="text-2xl font-bold">3</p>
        </div>
      </div>
    </div>

    <!-- Job Details Section -->
    <Collapsible 
      :open="isSectionExpanded('details')"
      class="rounded-lg border bg-card"
    >
      <CollapsibleTrigger 
        class="flex items-center justify-between w-full p-6 font-semibold"
        @click="toggleSection('details')"
      >
        Job Details
        <span class="text-muted-foreground">{{ isSectionExpanded('details') ? '▼' : '▶' }}</span>
      </CollapsibleTrigger>
      <CollapsibleContent class="px-6 pb-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium">Description</h3>
              <p class="text-sm text-muted-foreground">{{ job.description }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium">Responsibilities</h3>
              <ul class="list-disc list-inside text-sm text-muted-foreground">
                <li v-for="(resp, index) in job.responsibilities" :key="index">
                  {{ resp }}
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-sm font-medium">Requirements</h3>
              <div class="text-sm text-muted-foreground">
                <p v-if="job.requiredSkills">
                  <strong>Skills:</strong> {{ job.requiredSkills }}
                </p>
                <p v-if="job.languages">
                  <strong>Languages:</strong> {{ job.languages }}
                </p>
                <p v-if="job.dressCode">
                  <strong>Dress Code:</strong> {{ job.dressCode }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium">Schedule</h3>
              <div class="text-sm text-muted-foreground">
                <p>{{ formatDateTime(job.startDateTime) }} - {{ formatDateTime(job.endDateTime) }}</p>
                <p v-if="job.scheduleDescription">{{ job.scheduleDescription }}</p>
                <p v-if="job.isFlexibleTiming">Flexible timing available</p>
                <p>Duration: {{ job.duration }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium">Location</h3>
              <p class="text-sm text-muted-foreground">
                {{ job.location }}
                <span v-if="job.isRemote">(Remote)</span>
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium">Compensation</h3>
              <div class="text-sm text-muted-foreground">
                <p>{{ formatPayRate(job.payRateAmount, job.payRateDescription) }}</p>
                <p v-if="job.perks">Perks: {{ job.perks }}</p>
              </div>
            </div>

          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <!-- Applicants Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold tracking-tight">Applicants</h2>
          <p class="text-sm text-muted-foreground">Manage and review job applications</p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline">
            <FileDown class="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter class="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Quick Intro</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="applicant in applications" 
              :key="applicant.id"
              class="cursor-pointer hover:bg-muted/50"
              @click="handleRowClick(applicant)"
            >
              <TableCell>
                <div class="flex flex-col">
                  <span class="font-medium">{{ applicant.name }}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusBadgeVariant(applicant.status)">
                  {{ applicant.status }}
                </Badge>
              </TableCell>
              <TableCell>
                {{ formatDateTime(applicant.appliedAt) }}
              </TableCell>
              <TableCell class="max-w-md">
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ applicant.introduction }}
                </p>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" @click.stop>
                      <MoreHorizontal class="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      @click.stop="handleApplicantStatusChange(applicant, 'pending')"
                      :disabled="applicant.status === 'pending'"
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      @click.stop="handleApplicantStatusChange(applicant, 'shortlisted')"
                      :disabled="applicant.status === 'shortlisted'"
                    >
                      Shortlist
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      @click.stop="handleApplicantStatusChange(applicant, 'accepted')"
                      :disabled="applicant.status === 'accepted'"
                    >
                      Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      @click.stop="handleApplicantStatusChange(applicant, 'rejected')"
                      :disabled="applicant.status === 'rejected'"
                    >
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click.stop="handleApplicantAction('chat', applicant)">
                      <MessageSquare class="w-4 h-4 mr-2" />
                      Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem @click.stop="handleApplicantAction('view', applicant)">
                      <User class="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <JobDialog
      v-model:is-open="isDialogOpen"
      mode="edit"
      :job="job"
      @submit="handleDialogSubmit"
    />

    <!-- Applicant Details Dialog -->
    <Dialog :open="isDetailsDialogOpen" @update:open="isDetailsDialogOpen = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Applicant Details</DialogTitle>
        </DialogHeader>

        <div v-if="selectedApplication" class="space-y-6">
          <!-- Profile Photo -->
          <div class="flex justify-center">
            <div class="relative w-24 h-24 rounded-full overflow-hidden border bg-muted">
              <img
                v-if="selectedApplication.attachments?.find(a => a.type === 'image')"
                :src="selectedApplication.attachments.find(a => a.type === 'image')?.url"
                alt="Profile photo"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <User class="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <!-- Basic Info -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">{{ selectedApplication.name }}</h3>
                <p class="text-sm text-muted-foreground">Age: {{ selectedApplication.age }}</p>
              </div>
              <Badge :variant="getStatusBadgeVariant(selectedApplication.status)">
                {{ selectedApplication.status }}
              </Badge>
            </div>
          </div>

          <!-- Introduction -->
          <div class="space-y-2">
            <h4 class="font-medium">Introduction</h4>
            <p class="text-sm text-muted-foreground">
              {{ selectedApplication.introduction }}
            </p>
          </div>

          <!-- Education -->
          <div class="space-y-2">
            <h4 class="font-medium">Education</h4>
            <p class="text-sm text-muted-foreground">{{ selectedApplication.education }}</p>
          </div>

          <!-- Skills -->
          <div class="space-y-2">
            <h4 class="font-medium">Skills</h4>
            <p class="text-sm text-muted-foreground">{{ selectedApplication.skills }}</p>
          </div>

          <!-- Languages -->
          <div class="space-y-2">
            <h4 class="font-medium">Languages</h4>
            <p class="text-sm text-muted-foreground">{{ selectedApplication.languages }}</p>
          </div>

          <!-- Experience -->
          <div class="space-y-2">
            <h4 class="font-medium">Experience</h4>
            <p class="text-sm text-muted-foreground">{{ selectedApplication.experience }}</p>
          </div>

          <!-- Attachments -->
          <div v-if="selectedApplication.attachments?.length" class="space-y-2">
            <h4 class="font-medium">Attachments</h4>
            <div class="grid gap-2">
              <div 
                v-for="file in selectedApplication.attachments" 
                :key="file.name"
                class="flex items-center justify-between p-2 border rounded-md"
              >
                <div class="flex items-center gap-2">
                  <FileDown v-if="file.type === 'document'" class="w-4 h-4" />
                  <Image v-else class="w-4 h-4" />
                  <span class="text-sm">{{ file.name }}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  @click="downloadFile(file)"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>

          <!-- Application Info -->
          <div class="space-y-2">
            <h4 class="font-medium">Application Details</h4>
            <div class="text-sm">
              <p><span class="text-muted-foreground">Applied:</span> {{ formatDateTime(selectedApplication.appliedAt) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Change Status
                  <ChevronDown class="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  @click="handleApplicantStatusChange(selectedApplication!, 'pending')"
                  :disabled="selectedApplication?.status === 'pending'"
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem 
                  @click="handleApplicantStatusChange(selectedApplication!, 'shortlisted')"
                  :disabled="selectedApplication?.status === 'shortlisted'"
                >
                  Shortlist
                </DropdownMenuItem>
                <DropdownMenuItem 
                  @click="handleApplicantStatusChange(selectedApplication!, 'accepted')"
                  :disabled="selectedApplication?.status === 'accepted'"
                >
                  Accept
                </DropdownMenuItem>
                <DropdownMenuItem 
                  @click="handleApplicantStatusChange(selectedApplication!, 'rejected')"
                  :disabled="selectedApplication?.status === 'rejected'"
                >
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" @click="handleApplicantAction('chat', selectedApplication!)">
              <MessageSquare class="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template> 