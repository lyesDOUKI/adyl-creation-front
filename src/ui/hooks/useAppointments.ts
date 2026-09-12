import {useCallback} from "react";
import {appointmentUseCases} from "@/composition/container.ts";
import {useAsyncReadState} from "@/ui/hooks/core/use-async-read-state.ts";
import {Appointment} from "@/domain/appointment/Appointment.ts";

export const useAppointments = () => {
    const fetchAppointments = useCallback(() => appointmentUseCases.getAppointments(), []);
    return useAsyncReadState<Appointment[] | undefined>(fetchAppointments, []);
};

