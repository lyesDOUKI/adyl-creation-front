import {TimeSlot} from "@/domain/appointment/TimeSlot.ts";


export interface Appointment {
  id: string;
  slot: TimeSlot;
  status: AppointmentStatus;

  notes?: string;
  submittedAt?: Date;

  cancelledAt?: Date;
  cancelledReason?: string;
}
export type AppointmentStatus = 'SUBMITTED' | 'CONFIRMED' | 'CANCELLED';
