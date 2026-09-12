import type { TimeSlot } from '@/domain/appointment/TimeSlot';

const OPENING_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const SLOT_DURATION_MINUTES = 30;
const CLOSED_WEEKDAY = 5; // Vendredi


const buildSlot = (date: Date, time: string): TimeSlot => {
  const [hours, minutes] = time.split(':').map(Number);

  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + SLOT_DURATION_MINUTES);

  return { start, end };
};


export const generateTimeSlots = (date: Date): TimeSlot[] => {
  if (date.getDay() === CLOSED_WEEKDAY) return [];

  return OPENING_HOURS
      .filter((time) => {
        // Déterminisme de test : on "ferme" 1 créneau sur 3.
        const seed = date.getDate() + parseInt(time.replace(':', ''), 10);
        return seed % 3 !== 0;
      })
      .map((time) => buildSlot(date, time));
};