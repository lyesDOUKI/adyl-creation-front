import type { Appointment } from './Appointment';
import type { TimeSlot } from './TimeSlot';

export interface CreateAppointmentData {
  slot: TimeSlot;
  notes: string;
}

export interface AppointmentRepository {
  getAvailableSlots(date: Date): Promise<TimeSlot[]>;
  getUnavailableDates(): Promise<Date[]>;
  create(data: CreateAppointmentData): Promise<Appointment>;
  getAppointments(): Promise<Appointment[] | undefined>
}