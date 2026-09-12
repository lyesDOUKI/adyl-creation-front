import {AppointmentRepository, CreateAppointmentData} from "@/domain/appointment/AppointmentRepository.ts";
import {ApiClient} from "@/infrastructure/ApiClient.ts";
import {TimeSlot} from "@/domain/appointment/TimeSlot.ts";
import {Appointment, AppointmentStatus} from "@/domain/appointment/Appointment.ts";


interface TimeSlotResponse {
    start: string;
    end: string;
}

interface AvailableSlotsByDateResponse {
    date: string;
    slots: TimeSlotResponse[];
}

interface AvailableSlotsResponse {
    availability: AvailableSlotsByDateResponse[];
}

interface SubmitAppointmentRequest {
    start: string;
    end: string;
}

interface SubmitAppointmentResponse {
    appointmentId: string;
    start: string;
    end: string;
    status: string;
    submittedAt: string;
}


interface AppointmentsResponse {
    id: string;
    startAt: string;
    endAt: string;
    status: string;
    cancelledAt: string | null;
    cancelledReason: string | null;
}
export class ApiAppointmentRepository implements AppointmentRepository {
    private readonly availableSlotsRoute = '/appointments/available-slots';
    private readonly appointmentsRoute = '/appointments';

    constructor(private readonly apiClient: ApiClient) {}

    async getAppointments(): Promise<Appointment[]> {
        const response = await this.apiClient.get<AppointmentsResponse[]>(
            this.appointmentsRoute,
        );

        return response.map((item) => this.toAppointmentFromResponse(item));
    }

    async getAvailableSlots(date: Date): Promise<TimeSlot[]> {
        const dateKey = this.toDateKey(date);

        const response = await this.apiClient.get<AvailableSlotsResponse>(
            `${this.availableSlotsRoute}?from=${dateKey}&to=${dateKey}`,
        );

        const dayAvailability = response.availability.find(
            (day) => day.date === dateKey,
        );

        return (dayAvailability?.slots ?? []).map((slot) =>
            this.toTimeSlot(slot),
        );
    }

    async getUnavailableDates(): Promise<Date[]> {
        return [];
    }

    async create(data: CreateAppointmentData): Promise<Appointment> {
        const response = await this.apiClient.post<SubmitAppointmentResponse>(
            this.appointmentsRoute,
            this.toSubmitAppointmentRequest(data),
        );

        return this.toAppointment(response, data);
    }

    /* ============================================================
     * MAPPERS
     * ============================================================ */

    /**
     * Mapping depuis GET /appointments.
     *
     * Le back ne renvoie que les informations du rendez-vous :
     * - identité (id)
     * - créneau (startAt / endAt)
     * - statut (status)
     * - annulation éventuelle (cancelledAt / cancelledReason)
     *
     * Les champs customerName / customerPhone / notes / submittedAt
     * ne sont PAS exposés par cet endpoint : ils restent `undefined`
     * et ne doivent pas être inventés côté front.
     */
    private toAppointmentFromResponse(
        response: AppointmentsResponse,
    ): Appointment {
        return {
            id: response.id,
            slot: {
                start: new Date(response.startAt),
                end: new Date(response.endAt),
            },
            status: response.status as AppointmentStatus,
            cancelledAt: response.cancelledAt
                ? new Date(response.cancelledAt)
                : undefined,
            cancelledReason: response.cancelledReason ?? undefined,
        };
    }

    private toSubmitAppointmentRequest(
        data: CreateAppointmentData,
    ): SubmitAppointmentRequest {
        return {
            start: data.slot.start.toISOString(),
            end: data.slot.end.toISOString(),
        };
    }

    private toTimeSlot(response: TimeSlotResponse): TimeSlot {
        return {
            start: new Date(response.start),
            end: new Date(response.end),
        };
    }

    /**
     * SubmitAppointmentResponse ne renvoie pas customerName / customerPhone /
     * notes — on les récupère depuis les données déjà soumises (data),
     * jamais inventées ni laissées vides.
     *
     * response.status est casté vers AppointmentStatus sur la base du seul
     * exemple "SUBMITTED" connu : à confirmer avec la liste réelle des
     * statuts exposés par le back.
     */
    private toAppointment(
        response: SubmitAppointmentResponse,
        data: CreateAppointmentData,
    ): Appointment {
        return {
            id: response.appointmentId,
            slot: {
                start: new Date(response.start),
                end: new Date(response.end),
            },
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            notes: data.notes,
            status: response.status as AppointmentStatus,
            submittedAt: new Date(response.submittedAt),
        };
    }

    private toDateKey(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}