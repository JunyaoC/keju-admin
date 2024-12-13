<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useMarkdownEditor } from '@/composables/useMarkdownEditor'
import { useToast } from '@/components/ui/toast/use-toast'

interface User {
  id: string;
  email: string;
  name: string;
}

interface Profile {
  businessId?: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  businessLogo?: string | null;
  contactPerson: {
    name: string;
    role: string;
    department: string;
  };
}

interface Props {
  initialUser: User;
  initialProfile?: Profile;
}

const props = withDefaults(defineProps<Props>(), {
  initialProfile: () => ({
    businessName: '',
    businessAddress: '',
    businessDescription: '',
    businessLogo: null,
    contactPerson: {
      name: '',
      role: '',
      department: '',
    }
  })
});

const profile = ref({
  // Personal Information
  contactPerson: {
    name: props.initialProfile?.contactPerson?.name || props.initialUser.name || '',
    role: props.initialProfile?.contactPerson?.role || '',
    department: props.initialProfile?.contactPerson?.department || '',
  },
  
  // Business Information
  businessId: props.initialProfile?.businessId,
  businessName: props.initialProfile?.businessName || '',
  businessAddress: props.initialProfile?.businessAddress || '',
  businessDescription: props.initialProfile?.businessDescription || '',
  businessLogo: props.initialProfile?.businessLogo || '',
});

const isLoading = ref(false);
const { markdown, preview } = useMarkdownEditor(profile.value.businessDescription);
const { toast } = useToast();

watch(markdown, (newValue) => {
  profile.value.businessDescription = newValue;
});

interface ProfileResponse {
  business: {
    id: string;
    name: string;
    address: string;
    description: string;
    logo: string | null;
    isComplete: boolean;
  };
  employer: {
    id: string;
    role: string;
    department: string | null;
  };
}

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    
    const trimmedName = profile.value.contactPerson.name?.trim();
    if (!trimmedName) {
      throw new Error('Name is required');
    }
    
    const submitData = {
      businessId: props.initialProfile?.businessId,
      businessName: profile.value.businessName,
      businessAddress: profile.value.businessAddress,
      businessDescription: profile.value.businessDescription,
      businessLogo: profile.value.businessLogo,
      contactPerson: {
        ...profile.value.contactPerson,
        name: trimmedName,
      },
    };
    
    console.log('Submitting data:', submitData);
    
    const response = await fetch(`${window.location.origin}/api/profile/profile.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save profile');
    }

    const result: ProfileResponse = await response.json();
    console.log('Save result:', result);
    
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    toast({
      title: "Error",
      description: error.message || 'Failed to save profile',
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleLogoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          profile.value.businessLogo = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error converting file to base64:', error);
    }
  }
};
</script>

<template>
  <div class="container py-10 space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Settings</h1>
    </div>

    <div class="grid gap-6">
      <!-- Personal Information -->
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Manage your personal details
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input 
              id="name" 
              v-model="profile.contactPerson.name" 
              placeholder="Enter your name"
            />
          </div>
          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Input id="role" v-model="profile.contactPerson.role" />
          </div>
          <div class="space-y-2">
            <Label for="department">Department</Label>
            <Input id="department" v-model="profile.contactPerson.department" />
          </div>
        </CardContent>
      </Card>

      <!-- Business Information -->
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your business details and branding
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div 
                class="w-20 h-20 rounded-lg border flex items-center justify-center bg-muted"
                v-if="!profile.businessLogo"
              >
                <span class="text-xs text-muted-foreground text-center px-2">
                  Upload Logo
                </span>
              </div>
              <img
                v-else
                :src="profile.businessLogo"
                alt="Business Logo"
                class="w-20 h-20 rounded-lg object-cover border"
              />
              <div class="space-y-2">
                <Label for="logo">Business Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  @change="handleLogoUpload"
                />
                <p class="text-xs text-muted-foreground">
                  Max file size: 1MB. Supported formats: PNG, JPG
                </p>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="businessName">Business Name</Label>
              <Input id="businessName" v-model="profile.businessName" />
            </div>
            
            <div class="space-y-2">
              <Label for="businessAddress">Business Address</Label>
              <Input id="businessAddress" v-model="profile.businessAddress" />
            </div>

            <div class="space-y-2">
              <Label for="description">Business Description (Markdown)</Label>
              <div class="grid gap-4 sm:grid-cols-2">
                <Textarea
                  id="description"
                  v-model="markdown"
                  rows="10"
                  placeholder="Write your business description using Markdown..."
                />
                <div 
                  class="prose prose-sm dark:prose-invert border rounded-md p-4 overflow-y-auto"
                  style="height: 240px;"
                  v-html="preview"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button
            :disabled="isLoading"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template> 