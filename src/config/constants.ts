export const JOB_CATEGORIES = [
  { id: 'cafe_restaurant', label: 'Café/Restaurant' },
  { id: 'retail', label: 'Retail' },
  { id: 'event_staffing', label: 'Event Staffing' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'general_labor', label: 'General Labor' },
  { id: 'other', label: 'Other' }
] as const;

export const JOB_STATUSES = [
  { id: 'draft', label: 'Draft' },
  { id: 'published', label: 'Published' },
  { id: 'closed', label: 'Closed' }
] as const;

export const PAY_RATE_TYPES = [
  { id: 'per_hour', label: 'Per Hour' },
  { id: 'per_day', label: 'Per Day' },
  { id: 'per_month', label: 'Per Month' },
  { id: 'fixed', label: 'Fixed Rate' }
] as const; 