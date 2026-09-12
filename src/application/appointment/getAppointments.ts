import type {AppointmentRepository} from "@/domain/appointment/AppointmentRepository.ts";
import {Appointment} from "@/domain/appointment/Appointment.ts";

export const getAppointments = async (
    repository: AppointmentRepository
): Promise<Appointment[] | undefined> => repository.getAppointments();