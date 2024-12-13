export interface JobFormState {
  // Basic Info
  title: string;
  category: string;
  otherCategory?: string;
  description: string;
  responsibilities: string[];
  
  // Location & Schedule
  location: string;
  isRemote: boolean;
  startDateTime: string;
  endDateTime: string;
  isFlexibleTiming: boolean;
  duration: string;
  scheduleDescription?: string;
  
  // Compensation
  payRateAmount: number;
  payRateDescription: string;
  perks: string;
  specialNotes?: string;
  
  // Requirements (all optional)
  requiredSkills: string;
  languages: string;
  dressCode: string;
  additionalRequirements: string;
  
  // Additional Details
  contactPerson?: {
    name: string;
    phone?: string;
    email?: string;
  };
  
  // Visibility
  visibilityDuration: string;
  notifications: {
    newApplication: boolean;
    messageResponse: boolean;
    jobExpiry: boolean;
  };
}

export interface JobStats {
  views: number;
  applicants: number;
  shortlisted: number;
}

export interface Job extends JobFormState {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'closed';
  stats?: JobStats;
}

export interface Applicant {
  id: string;
  name: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
  
  // Additional fields
  age: number;
  education: string;
  skills: string;
  languages: string;
  introduction: string;
  experience: string;
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'document';
  }[];
} 