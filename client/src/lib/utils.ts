import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: Date): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: id });
}

export function formatDateTime(date: Date): string {
  return format(new Date(date), 'd MMMM yyyy, HH:mm', { locale: id });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'submitted':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}
