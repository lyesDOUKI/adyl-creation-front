import type { TimeSlot } from '@/domain/appointment/TimeSlot';

const OPENING_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const CLOSED_WEEKDAY = 5; // Vendredi

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  if (date.getDay() === CLOSED_WEEKDAY) return [];
  return OPENING_HOURS.map(time => {
    const seed = date.getDate() + parseInt(time.replace(':', ''));
    return { time, available: seed % 3 !== 0 };
  });
};
