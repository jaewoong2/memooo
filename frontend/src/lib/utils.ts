import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Event } from '@/atoms/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type EventStatus = 'ongoing' | 'upcoming' | 'ended';

export function getEventStatus(event: Pick<Event, 'eventStartDate' | 'eventEndDate'>): EventStatus {
  const now = new Date();

  const startDate = new Date(event.eventStartDate);
  const endDate = new Date(event.eventEndDate);

  if (startDate && endDate) {
    if (now < startDate) {
      return 'upcoming';
    } else if (now >= startDate && now <= endDate) {
      return 'ongoing';
    } else {
      return 'ended';
    }
  } else if (startDate) {
    if (now < startDate) {
      return 'upcoming';
    } else {
      return 'ongoing';
    }
  } else {
    // If no dates are provided, default to 'ongoing' or handle as needed
    return 'ongoing';
  }
}

export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms ?? 1000);
  });
}
