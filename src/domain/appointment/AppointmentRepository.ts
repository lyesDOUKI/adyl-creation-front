import type { Appointment } from './Appointment';
import type { TimeSlot } from './TimeSlot';

export interface CreateAppointmentData {
  date: Date;
  time: string;
  customerName: string;
  customerPhone: string;
  notes: string;
}

export interface AppointmentRepository {
  getAvailableSlots(date: Date): Promise<TimeSlot[]>;
  getUnavailableDates(): Promise<Date[]>;
  create(data: CreateAppointmentData): Promise<Appointment>;
}