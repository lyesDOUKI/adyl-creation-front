import type { AppointmentRepository } from '@/domain/appointment/AppointmentRepository';

export const getUnavailableDates = (
  repository: AppointmentRepository,
): Promise<Date[]> => repository.getUnavailableDates();
