

import { useCallback } from 'react';
import { useAsyncReadState } from './core/use-async-read-state';
import { appointmentUseCases } from '@/composition/container';

export const useAvailableSlots = (date: Date | undefined) => {
  const fetchSlots = useCallback(
    () => (date ? appointmentUseCases.getAvailableSlots(date) : Promise.resolve([])),
    [date]
  );
  return useAsyncReadState(fetchSlots, []);
};