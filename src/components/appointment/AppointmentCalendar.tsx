import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useAvailableSlots } from '@/ui/hooks/useAvailableSlots';
import { useUnavailableDates } from '@/ui/hooks/useUnavailableDates';
import { isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Spinner } from '../ui/spinner';
import { ErrorMessage } from '../ui/error-message';
import { TimeSlot } from '@/domain/appointment/TimeSlot.ts';
import { formatSlotTime } from '@/infrastructure/appointment/SlotFormat.ts';

type AppointmentCalendarMode = 'date' | 'slot';

interface AppointmentCalendarProps {
  mode: AppointmentCalendarMode;
  selectedDate?: Date;
  selectedSlot?: TimeSlot;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slot: TimeSlot) => void;
}

export const AppointmentCalendar = ({
                                      mode,
                                      selectedDate,
                                      selectedSlot,
                                      onDateSelect,
                                      onSlotSelect,
                                    }: AppointmentCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const {
    data: slots,
    isLoading: loadingSlots,
    error: slotsError,
  } = useAvailableSlots(date);

  const {
    data: unavailableDates,
    isLoading: loadingUnavailable,
    error: unavailableError,
  } = useUnavailableDates();

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    onDateSelect(newDate);
  };

  /**
   * Toutes les règles de disponibilité viennent du back
   * via `useUnavailableDates` (jours fermés, congés, etc.).
   * Le front ne code en dur que la règle universelle :
   * on ne peut pas réserver dans le passé.
   */
  const isDateDisabled = (value: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (value < today) return true;

    return (unavailableDates ?? []).some((d) => isSameDay(d, value));
  };

  const isSlotSelected = (slot: TimeSlot) => {
    if (!selectedSlot || !selectedDate || !date) return false;
    return (
        isSameDay(selectedDate, date) &&
        selectedSlot.start.getTime() === slot.start.getTime()
    );
  };

  /* ============================================================
   * DATE MODE
   * ============================================================ */

  if (mode === 'date') {
    if (loadingUnavailable) {
      return (
          <div className="flex h-[340px] items-center justify-center">
            <Spinner />
          </div>
      );
    }

    if (unavailableError) {
      return <ErrorMessage message={unavailableError} />;
    }

    return (
        <div className="flex justify-center">
          <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              locale={fr}
              className="pointer-events-auto p-0"
          />
        </div>
    );
  }

  /* ============================================================
   * SLOT MODE
   * ============================================================ */

  if (!date) return null;

  if (loadingSlots) {
    return (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
    );
  }

  if (slotsError) {
    return <ErrorMessage message={slotsError} />;
  }

  const availableSlots = slots ?? [];

  if (availableSlots.length === 0) {
    return (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm font-medium">Aucun créneau ce jour</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essayez une autre date dans le calendrier.
          </p>
        </div>
    );
  }

  return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {availableSlots.map((slot) => {
          const selected = isSlotSelected(slot);

          return (
              <button
                  key={slot.start.toISOString()}
                  type="button"
                  onClick={() => onSlotSelect(slot)}
                  className={
                      'flex h-14 items-center justify-center rounded-lg border text-base font-medium tabular-nums transition-colors ' +
                      (selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-primary/60 hover:bg-primary/5')
                  }
              >
                {formatSlotTime(slot.start)}
              </button>
          );
        })}
      </div>
  );
};