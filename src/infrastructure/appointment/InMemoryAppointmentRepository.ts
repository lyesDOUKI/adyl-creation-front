import type { Appointment } from '@/domain/appointment/Appointment';
import type {
  AppointmentRepository,
  CreateAppointmentData,
} from '@/domain/appointment/AppointmentRepository';
import type { TimeSlot } from '@/domain/appointment/TimeSlot';
import { generateTimeSlots } from './timeSlotGenerator';
import { unavailableDatesSeed } from './unavailableDatesSeed';

export class InMemoryAppointmentRepository implements AppointmentRepository {
  async getAvailableSlots(date: Date): Promise<TimeSlot[]> {
    return generateTimeSlots(date);
  }

  async getUnavailableDates(): Promise<Date[]> {
    return unavailableDatesSeed;
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    return {
      id: `RDV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`,
      date: data.date,
      time: data.time,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      notes: data.notes,
      status: 'pending',
    };
  }
}