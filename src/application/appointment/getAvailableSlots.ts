import type { AppointmentRepository } from '@/domain/appointment/AppointmentRepository';
import type { TimeSlot } from '@/domain/appointment/TimeSlot';

export const getAvailableSlots = async (
  repository: AppointmentRepository,
  date: Date,
): Promise<TimeSlot[]> => repository.getAvailableSlots(date);
