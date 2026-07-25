import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppointmentCalendar } from '@/components/appointment/AppointmentCalendar';
import { useCreateAppointment } from '@/ui/hooks/useCreateAppointment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ErrorMessage } from '@/components/ui/error-message';

const Appointments = () => {
  const { toast } = useToast();
  const { isSubmitting, error, submitAction } = useCreateAppointment();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [confirmed, setConfirmed] = useState(false);

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const appointment = await submitAction({
      date: selectedDate,
      time: selectedTime,
      customerName: form.name,
      customerPhone: form.phone,
      notes: form.notes,
    });

    if (!appointment) return;

    setConfirmed(true);
    toast({
      title: 'Rendez-vous confirmé !',
      description: `Le ${format(selectedDate, 'EEEE d MMMM', { locale: fr })} à ${selectedTime}`,
    });
  };

  const reset = () => {
    setConfirmed(false);
    setSelectedDate(undefined);
    setSelectedTime('');
    setForm({ name: '', phone: '', notes: '' });
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="p-8 text-center space-y-4 max-w-md animate-scale-in">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-heading font-bold">Rendez-vous confirmé !</h2>
            {selectedDate && (
              <p className="text-muted-foreground">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Nous vous contacterons pour confirmer les détails.
            </p>
            <Button onClick={reset}>Prendre un autre rendez-vous</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Prendre rendez-vous</h1>
            <p className="text-muted-foreground">
              Pour un article personnalisé, choisissez un créneau et on en discutera ensemble !
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <AppointmentCalendar
              onSlotSelect={handleSlotSelect}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />

            {selectedDate && selectedTime ? (
              <Card className="p-6 animate-slide-up">
                <h3 className="font-heading font-semibold text-lg mb-1">Vos informations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <CalendarDays className="inline h-4 w-4 mr-1" />
                  {format(selectedDate, 'EEEE d MMMM', { locale: fr })} à {selectedTime}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rdv-name">Nom</Label>
                    <Input id="rdv-name" required value={form.name} onChange={update('name')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rdv-phone">Téléphone</Label>
                    <Input id="rdv-phone" required value={form.phone} onChange={update('phone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rdv-notes">Décrivez votre projet</Label>
                    <Textarea
                      id="rdv-notes"
                      rows={3}
                      value={form.notes}
                      onChange={update('notes')}
                      placeholder="Couleurs, taille, type d'article..."
                    />
                  </div>
                  {error && <ErrorMessage message={error} />}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi en cours...' : 'Confirmer le rendez-vous'}
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="p-6 flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground text-center">
                  ← Sélectionnez une date et un créneau pour continuer
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
