import { useCallback } from 'react';
import { useAsyncReadState } from './core/use-async-read-state';
import { appointmentUseCases } from '@/composition/container';

export const useUnavailableDates = () => {
  const fetchDates = useCallback(() => appointmentUseCases.getUnavailableDates(), []);
  return useAsyncReadState(fetchDates, []);
};