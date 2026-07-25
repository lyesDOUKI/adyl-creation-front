import type { Appointment } from '@/domain/appointment/Appointment';
import type {
  AppointmentRepository,
  CreateAppointmentData,
} from '@/domain/appointment/AppointmentRepository';

export const createAppointment = async (
  repository: AppointmentRepository,
  data: CreateAppointmentData,
): Promise<Appointment> => repository.create(data);
