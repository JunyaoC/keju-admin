export type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';

export const getStatusBadgeVariant = (status: ApplicationStatus) => {
  const variants = {
    pending: 'secondary',
    shortlisted: 'default',
    accepted: 'success',
    rejected: 'destructive'
  };
  return variants[status];
}; 