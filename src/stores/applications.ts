import { atom, map } from 'nanostores';
import type { Applicant } from '@/components/jobs/types';

// Mock data
const mockApplicants: Applicant[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    status: 'pending',
    appliedAt: '2024-02-15T08:30:00Z',
    introduction: 'Passionate about hospitality with 3 years of F&B experience. Looking for weekend shifts to supplement studies.',
    age: 23,
    education: 'Bachelor\'s Degree in Hospitality Management, Taylor\'s University (2023)',
    skills: 'Customer Service, Barista, POS Systems, Food Safety',
    languages: 'English (Fluent), Mandarin (Native), Malay (Intermediate)',
    experience: '3 years experience as part-time barista at various cafes during studies',
    attachments: [
      { name: 'Resume.pdf', url: 'path/to/resume.pdf', type: 'document' },
      { name: 'Barista Certificate', url: 'path/to/cert.pdf', type: 'document' },
      { name: 'Profile Photo', url: 'path/to/photo.jpg', type: 'image' }
    ]
  },
  {
    id: '2',
    name: 'Ahmad bin Abdullah',
    status: 'shortlisted',
    appliedAt: '2024-02-14T15:45:00Z',
    introduction: 'Former restaurant manager seeking new opportunities. Available immediately for full-time position.',
    age: 28,
    education: 'Diploma in Culinary Arts, KDU University College (2018)',
    skills: 'Team Management, Restaurant Operations, Inventory Control, Staff Training',
    languages: 'Malay (Native), English (Fluent)',
    experience: '5 years experience including 3 years as Restaurant Manager at local chain restaurant',
    attachments: [
      { name: 'Resume.pdf', url: 'path/to/ahmad_resume.pdf', type: 'document' }
    ]
  },
  {
    id: '3',
    name: 'Raj Kumar',
    status: 'rejected',
    appliedAt: '2024-02-13T11:20:00Z',
    introduction: 'Student looking for part-time work. Flexible schedule and eager to learn new skills.',
    age: 21,
    education: 'Currently pursuing Business Administration at HELP University',
    skills: 'Customer Service, Basic Accounting, MS Office',
    languages: 'English (Fluent), Tamil (Native), Malay (Intermediate)',
    experience: '1 year part-time retail experience',
    attachments: [
      { name: 'Resume.pdf', url: 'path/to/raj_resume.pdf', type: 'document' }
    ]
  }
];

// Store for applications list
export const $applications = atom<Applicant[]>(mockApplicants);

// Store for selected application
export const $selectedApplication = atom<Applicant | null>(null);

// Store for application filters
export const $applicationFilters = map({
  search: '',
  status: '',
  jobId: '',
});

// Store for loading states
export const $applicationLoading = map({
  list: false,
  details: false,
  update: false
});