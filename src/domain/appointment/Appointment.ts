export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  status: AppointmentStatus;
}
