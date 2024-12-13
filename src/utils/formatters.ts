export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPayRate(amount: number, description: string) {
  return `RM ${amount.toFixed(2)} ${description}`;
}

export function formatCategory(category: string) {
  const categoryMap: Record<string, string> = {
    'cafe_restaurant': 'Café/Restaurant',
    'event_staffing': 'Event Staffing',
    // ... other mappings
  };
  return categoryMap[category] || category;
} 