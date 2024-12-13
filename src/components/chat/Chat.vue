<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, ChevronDown, ChevronRight, MessageSquare } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'applicant';
  read: boolean;
}

interface Application {
  id: string;
  jobTitle: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
  jobId: string;
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  application: Application;
}

// Mock data
const contacts = ref<ChatContact[]>([
  {
    id: '1',
    name: 'Sarah Chen',
    lastMessage: {
      id: 'm1',
      content: 'Thank you for considering my application',
      timestamp: '2024-02-15T08:30:00Z',
      sender: 'applicant',
      read: true
    },
    unreadCount: 0,
    application: {
      id: 'app1',
      jobTitle: 'Weekend Barista',
      status: 'shortlisted',
      appliedAt: '2024-02-15T08:00:00Z',
      jobId: 'job1'
    }
  },
  {
    id: '2',
    name: 'Ahmad Abdullah',
    lastMessage: {
      id: 'm2',
      content: 'When can I start the job?',
      timestamp: '2024-02-14T15:45:00Z',
      sender: 'applicant',
      read: false
    },
    unreadCount: 2,
    application: {
      id: 'app2',
      jobTitle: 'Event Staff',
      status: 'pending',
      appliedAt: '2024-02-14T15:00:00Z',
      jobId: 'job2'
    }
  }
]);

const messages = ref<ChatMessage[]>([
  {
    id: 'm1',
    content: 'Hi, I am interested in the Weekend Barista position',
    timestamp: '2024-02-15T08:00:00Z',
    sender: 'applicant',
    read: true
  },
  {
    id: 'm2',
    content: 'Thank you for your interest! When can you start?',
    timestamp: '2024-02-15T08:15:00Z',
    sender: 'user',
    read: true
  },
  {
    id: 'm3',
    content: 'I can start next week',
    timestamp: '2024-02-15T08:20:00Z',
    sender: 'applicant',
    read: true
  }
]);

const selectedContact = ref<ChatContact | null>(null);
const newMessage = ref('');
const searchQuery = ref('');
const isJobDetailsPinned = ref(false);
const scrollAreaRef = ref<InstanceType<typeof ScrollArea> | null>(null);

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const handleContactSelect = (contact: ChatContact) => {
  selectedContact.value = contact;
  contact.unreadCount = 0;
  nextTick(scrollToBottom);
};

const scrollToBottom = () => {
  // Wait for DOM update
  nextTick(() => {
    const viewport = scrollAreaRef.value?.$el.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedContact.value) return;

  const message: ChatMessage = {
    id: `m${Date.now()}`,
    content: newMessage.value,
    timestamp: new Date().toISOString(),
    sender: 'user',
    read: true
  };

  messages.value.push(message);
  selectedContact.value.lastMessage = message;
  newMessage.value = '';
  scrollToBottom();
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'default';
    case 'shortlisted':
      return 'secondary';
    case 'accepted':
      return 'destructive';
    case 'rejected':
      return 'destructive';
    default:
      return 'default';
  }
};

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const navigateToJob = (jobId: string) => {
  window.location.href = `/admin/jobs/${jobId}`;
};
</script>

<template>
  <div class="container h-[calc(100vh-4rem)] py-6">
    <div class="grid grid-cols-[350px_1fr] h-full gap-0 rounded-lg border bg-background">
      <!-- Contacts List -->
      <div class="border-r flex flex-col">
        <!-- Search -->
        <div class="p-4 border-b">
          <div class="relative">
            <Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search conversations..."
              class="pl-9"
            />
          </div>
        </div>

        <!-- Contacts -->
        <ScrollArea class="flex-1">
          <div class="space-y-0.5 p-1.5">
            <button
              v-for="contact in contacts"
              :key="contact.id"
              class="w-full p-4 text-left hover:bg-muted transition-colors rounded-lg"
              :class="{ 'bg-muted': selectedContact?.id === contact.id }"
              @click="handleContactSelect(contact)"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ contact.name }}</p>
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ contact.lastMessage ? formatTime(contact.lastMessage.timestamp) : '' }}
                </div>
              </div>
              <div class="flex justify-between items-center mt-1">
                <p class="text-sm text-muted-foreground truncate max-w-[200px]">
                  {{ contact.lastMessage?.content }}
                </p>
                <div v-if="contact.unreadCount > 0" class="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {{ contact.unreadCount }}
                </div>
              </div>
            </button>
          </div>
        </ScrollArea>
      </div>

      <!-- Chat Area -->
      <div class="grid grid-rows-[auto_1fr_auto] h-full overflow-hidden">
        <!-- Chat Header -->
        <div v-if="selectedContact" class="border-b bg-background z-10">
          <!-- Contact Info -->
          <div class="p-4 flex justify-between items-center">
            <h2 class="font-semibold">{{ selectedContact.name }}</h2>
            <Button 
              variant="ghost" 
              size="sm"
              class="gap-2"
              @click="isJobDetailsPinned = !isJobDetailsPinned"
            >
              <span class="text-sm">Job Details</span>
              <component :is="isJobDetailsPinned ? ChevronDown : ChevronRight" class="h-4 w-4" />
            </Button>
          </div>

          <!-- Pinned Job Details -->
          <div v-if="isJobDetailsPinned" class="px-4 pb-3 space-y-3 text-sm border-t bg-muted/50">
            <div class="flex items-center justify-between pt-3">
              <div class="flex items-center gap-2">
                <Badge variant="outline">{{ selectedContact.application.jobTitle }}</Badge>
                <Badge :variant="getStatusBadgeVariant(selectedContact.application.status)">
                  {{ selectedContact.application.status }}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                @click="navigateToJob(selectedContact.application.jobId)"
              >
                View Job
              </Button>
            </div>
            <div class="flex items-center gap-4 text-muted-foreground">
              <div>Applied: {{ formatDateTime(selectedContact.application.appliedAt) }}</div>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div v-if="selectedContact" class="overflow-hidden">
          <ScrollArea 
            ref="scrollAreaRef"
            class="h-full" 
          >
            <div class="space-y-4 min-h-full p-4">
              <div
                v-for="message in messages"
                :key="message.id"
                class="flex"
                :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[70%] rounded-lg px-4 py-2"
                  :class="message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
                >
                  <p>{{ message.content }}</p>
                  <p class="text-xs mt-1 opacity-70">{{ formatTime(message.timestamp) }}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <!-- Message Input -->
        <div 
          v-if="selectedContact" 
          class="border-t bg-background p-4 z-10"
        >
          <form @submit.prevent="sendMessage" class="grid grid-cols-[1fr_auto] gap-2">
            <Input
              v-model="newMessage"
              placeholder="Type a message..."
            />
            <Button type="submit" size="icon" class="h-10 w-10">
              <Send class="h-4 w-4" />
            </Button>
          </form>
        </div>

        <!-- No Contact Selected -->
        <div
          v-if="!selectedContact"
          class="row-span-full col-span-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10"
        >
          <div class="flex flex-col items-center gap-2">
            <MessageSquare class="h-12 w-12 text-muted-foreground/50" />
            <h3 class="text-lg font-medium">No conversation selected</h3>
            <p class="text-sm text-muted-foreground">Choose a contact to start chatting</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 