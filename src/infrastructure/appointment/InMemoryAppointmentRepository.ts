import type { Appointment } from '@/domain/appointment/Appointment';
import type {
  AppointmentRepository,
  CreateAppointmentData,
} from '@/domain/appointment/AppointmentRepository';
import type { TimeSlot } from '@/domain/appointment/TimeSlot';
import { unavailableDatesSeed } from './unavailableDatesSeed';
import {generateTimeSlots} from "@/infrastructure/appointment/timeSlotGenerator.ts";

export class InMemoryAppointmentRepository implements AppointmentRepository {
  getAppointments(): Promise<Appointment[]> {
      throw new Error("Method not implemented.");
  }
  async getAvailableSlots(date: Date): Promise<TimeSlot[]> {
    return generateTimeSlots(date);
  }

  async getUnavailableDates(): Promise<Date[]> {
    return unavailableDatesSeed;
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    return {
      id: `RDV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`,
      slot: data.slot,
      notes: data.notes,
      status: 'SUBMITTED',
    };
  }
}