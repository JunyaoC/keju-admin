import { atom } from 'nanostores';

export interface BusinessProfile {
  isComplete: boolean;
  businessName: string;
  businessLogo?: string;
  businessDescription?: string;
  contactPerson?: {
    name: string;
    role: string;
    department?: string;
  };
}

// Initialize with some demo data
export const $profile = atom<BusinessProfile>({
  isComplete: true,
  businessName: 'TechCorp Solutions',
  businessDescription: 'Leading technology solutions provider',
  contactPerson: {
    name: 'John Doe',
    role: 'HR Manager',
    department: 'Human Resources'
  }
}); 