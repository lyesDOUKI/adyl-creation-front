import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useAvailableSlots } from '@/ui/hooks/useAvailableSlots';
import { useUnavailableDates } from '@/ui/hooks/useUnavailableDates';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Spinner } from '../ui/spinner';
import { ErrorMessage } from '../ui/error-message';

interface AppointmentCalendarProps {
  onSlotSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export const AppointmentCalendar = ({ onSlotSelect, selectedDate, selectedTime }: AppointmentCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const { data: slots, isLoading: loadingAvailableSlots, error: errorLoadingSlots } = useAvailableSlots(date);

  const { data: unavailableDates, isLoading, error } = useUnavailableDates();
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTimeSelect = (time: string) => {
    if (date) {
      onSlotSelect(date, time);
    }
  };

  const isDateDisabled = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return true;
    if (d.getDay() === 5) return true;
    return unavailableDates.some(ud => ud.toDateString() === d.toDateString());
  };

  if (loadingAvailableSlots) {
    return <Spinner />;
  }

  if (errorLoadingSlots) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        className="rounded-lg border shadow-card pointer-events-auto"
      />

      {date && slots.length > 0 && (
        <div className="animate-slide-up space-y-3">
          <h3 className="font-heading font-semibold">
            Créneaux — {format(date, 'EEEE d MMMM', { locale: fr })}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {slots.map(slot => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time && selectedDate?.toDateString() === date.toDateString() ? 'default' : 'outline'}
                disabled={!slot.available}
                onClick={() => handleTimeSelect(slot.time)}
                className="text-sm"
                size="sm"
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {date && slots.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">Aucun créneau disponible ce jour.</p>
      )}
    </div>
  );
};
