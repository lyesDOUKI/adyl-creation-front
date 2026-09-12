import { appointmentUseCases } from '@/composition/container';

import { useAsyncCreateState } from './core/use-async-create-state';

export const useCreateAppointment = () => {
  return useAsyncCreateState(appointmentUseCases.create);
};
