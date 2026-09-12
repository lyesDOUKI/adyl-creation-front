import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppointmentCalendar } from '@/components/appointment/AppointmentCalendar';
import { useCreateAppointment } from '@/ui/hooks/useCreateAppointment';
import { useAuth } from '@/ui/hooks/useAuth';
import { useAppointments } from '@/ui/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle,
  Clock,
  LockKeyhole,
  LogIn,
  MessageSquare,
  Phone,
  Timer,
  User,
  UserPlus,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ErrorMessage } from '@/components/ui/error-message';
import { Spinner } from '@/components/ui/spinner';
import { Appointment, AppointmentStatus } from '@/domain/appointment/Appointment';
import { TimeSlot } from '@/domain/appointment/TimeSlot.ts';
import {
  formatSlotDuration,
  formatSlotTime,
} from '@/infrastructure/appointment/SlotFormat.ts';
import { ReadonlyField } from '@/components/ui/ReadonlyField.tsx';

type StepId = 1 | 2 | 3;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Date' },
  { id: 2, label: 'Créneau' },
  { id: 3, label: 'Récapitulatif' },
];

/* ============================================================
 * STATUS CONFIG
 * ============================================================ */

const getStatusConfig = (status: AppointmentStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'Confirmé',
        className: 'bg-primary/10 text-primary border-primary/20',
      };
    case 'CANCELLED':
      return {
        label: 'Annulé',
        className:
            'bg-destructive/10 text-destructive border-destructive/20',
      };
    case 'SUBMITTED':
    default:
      return {
        label: 'En attente',
        className: 'bg-muted text-muted-foreground border-border',
      };
  }
};

/* ============================================================
 * APPOINTMENT ITEM
 * ============================================================ */

const AppointmentItem = ({ appointment }: { appointment: Appointment }) => {
  const status = getStatusConfig(appointment.status);
  const isCancelled = appointment.status === 'CANCELLED';

  const dayNumber = format(appointment.slot.start, 'd', { locale: fr });
  const monthShort = format(appointment.slot.start, 'MMM', { locale: fr });
  const weekday = format(appointment.slot.start, 'EEEE', { locale: fr });

  return (
      <li className="group flex gap-3 rounded-lg border bg-card p-3 transition-all duration-150 hover:border-primary/30 hover:bg-muted/30">
        {/* Date badge */}
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/40 transition-colors group-hover:bg-background">
        <span className="font-heading text-base font-bold leading-none tabular-nums">
          {dayNumber}
        </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {monthShort}
        </span>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium capitalize text-muted-foreground">
            {weekday}
          </span>

            <span
                className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none ${status.className}`}
            >
            {status.label}
          </span>
          </div>

          <p
              className={`text-sm font-medium tabular-nums ${
                  isCancelled ? 'text-muted-foreground line-through' : ''
              }`}
          >
            {formatSlotTime(appointment.slot.start)} —{' '}
            {formatSlotTime(appointment.slot.end)}
          </p>

          {isCancelled && appointment.cancelledReason && (
              <p className="mt-0.5 truncate text-xs italic text-muted-foreground">
                {appointment.cancelledReason}
              </p>
          )}
        </div>
      </li>
  );
};

/* ============================================================
 * APPOINTMENTS PANEL
 * ============================================================ */

const AppointmentsPanel = () => {
  const {
    data: appointments,
    isLoading,
    error,
  } = useAppointments();

  const now = new Date();

  const sorted = [...(appointments ?? [])].sort(
      (a, b) => a.slot.start.getTime() - b.slot.start.getTime(),
  );

  const upcoming = sorted.filter((a) => a.slot.start >= now);
  const past = sorted.filter((a) => a.slot.start < now).reverse();

  return (
      <Card className="overflow-hidden">
        {/* Header — sticky dans la Card */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />

            <h2 className="text-sm font-heading font-bold">
              Mes rendez-vous
            </h2>
          </div>

          {!isLoading && !error && upcoming.length > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
            {upcoming.length}
          </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Spinner />
              </div>
          ) : error ? (
              <ErrorMessage message={error} />
          ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="text-sm font-medium">Aucun rendez-vous</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Votre premier rendez-vous apparaîtra ici.
                </p>
              </div>
          ) : (
              <div className="max-h-[calc(100vh-16rem)] space-y-5 overflow-y-auto pr-1">
                {/* Upcoming */}
                {upcoming.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        À venir
                      </p>

                      <ul className="space-y-2">
                        {upcoming.map((appointment) => (
                            <AppointmentItem
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))}
                      </ul>
                    </div>
                )}

                {/* Past */}
                {past.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Historique
                      </p>

                      <ul className="space-y-2 opacity-70">
                        {past.map((appointment) => (
                            <AppointmentItem
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))}
                      </ul>
                    </div>
                )}
              </div>
          )}
        </div>
      </Card>
  );
};

/* ============================================================
 * PAGE
 * ============================================================ */

const Appointments = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, login, register, user } = useAuth();
  const { isSubmitting, error, submitAction } = useCreateAppointment();

  const [step, setStep] = useState<StepId>(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>();
  const [notes, setNotes] = useState('');
  const [confirmedSlot, setConfirmedSlot] = useState<TimeSlot>();

  const userPhone = user?.phone ?? '';
  const fullName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(' ');

  const isCustomerReady = Boolean(user?.email && userPhone);

  const canReachStep = (target: StepId) => {
    if (target === 1) return true;
    if (target === 2) return Boolean(selectedDate);
    return Boolean(selectedDate && selectedSlot);
  };

  const goToStep = (target: StepId) => {
    if (canReachStep(target)) setStep(target);
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !isCustomerReady) return;

    const appointment = await submitAction({
      slot: selectedSlot,
      notes,
    });

    if (!appointment) return;

    setConfirmedSlot(appointment.slot);

    toast({
      title: 'Rendez-vous confirmé !',
      description: `Le ${format(appointment.slot.start, 'EEEE d MMMM', {
        locale: fr,
      })} à ${formatSlotTime(appointment.slot.start)}`,
    });
  };

  const handleLogin = async () => {
    await login();
  };

  const handleRegister = async () => {
    await register();
  };

  const reset = () => {
    setConfirmedSlot(undefined);
    setSelectedDate(undefined);
    setSelectedSlot(undefined);
    setNotes('');
    setStep(1);
  };

  /* ============================================================
   * SUCCESS
   * ============================================================ */

  if (confirmedSlot) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-1 container py-8 animate-fade-in">
            <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div className="flex items-start justify-center">
                <Card className="w-full max-w-md p-8 text-center space-y-5 animate-scale-in">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto" />

                  <div>
                    <h2 className="text-2xl font-heading font-bold">
                      Rendez-vous confirmé !
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                      Votre rendez-vous est bien enregistré.
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm font-medium capitalize">
                      {format(
                          confirmedSlot.start,
                          'EEEE d MMMM yyyy',
                          { locale: fr },
                      )}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatSlotTime(confirmedSlot.start)} —{' '}
                      {formatSlotTime(confirmedSlot.end)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatSlotDuration(
                          confirmedSlot.start,
                          confirmedSlot.end,
                      )}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Nous vous contacterons pour confirmer les détails.
                  </p>

                  <Button onClick={reset} className="w-full">
                    Prendre un autre rendez-vous
                  </Button>
                </Card>
              </div>

              <aside className="lg:sticky lg:top-8 lg:self-start">
                <AppointmentsPanel />
              </aside>
            </div>
          </main>

          <Footer />
        </div>
    );
  }

  /* ============================================================
   * PAGE
   * ============================================================ */

  return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container py-8 animate-fade-in">
          <div className="max-w-6xl mx-auto">

            {/* HEADER */}

            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold mb-2">
                Prendre rendez-vous
              </h1>

              <p className="text-muted-foreground">
                Choisissez une date, puis le créneau qui vous convient.
              </p>
            </div>

            {/* STEPS — barre compacte centrée, ne s'étale plus sur
              toute la largeur du conteneur. */}

            <div className="mb-8 mx-auto max-w-lg">
              <ol className="flex items-center">
                {STEPS.map((currentStep, index) => {
                  const isCurrent = step === currentStep.id;
                  const isCompleted = step > currentStep.id;
                  const isClickable = canReachStep(currentStep.id);

                  return (
                      <li
                          key={currentStep.id}
                          className="flex items-center flex-1 last:flex-none"
                      >
                        <button
                            type="button"
                            onClick={() => {
                              if (isClickable) goToStep(currentStep.id);
                            }}
                            disabled={!isClickable}
                            className="flex items-center gap-2 group disabled:cursor-not-allowed"
                        >
                      <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                              isCompleted
                                  ? 'bg-primary text-primary-foreground'
                                  : isCurrent
                                      ? 'bg-primary/10 text-primary ring-2 ring-primary'
                                      : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {isCompleted ? (
                            <Check className="h-3.5 w-3.5" />
                        ) : (
                            currentStep.id
                        )}
                      </span>

                          <span
                              className={`text-sm font-medium hidden sm:block ${
                                  isCurrent
                                      ? 'text-foreground'
                                      : 'text-muted-foreground'
                              }`}
                          >
                        {currentStep.label}
                      </span>
                        </button>

                        {index < STEPS.length - 1 && (
                            <div
                                className={`h-px flex-1 mx-2.5 ${
                                    step > currentStep.id
                                        ? 'bg-primary'
                                        : 'bg-border'
                                }`}
                            />
                        )}
                      </li>
                  );
                })}
              </ol>
            </div>

            {/* GRID — wizard à gauche, aside à droite. */}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">

              {/* LEFT — WIZARD */}

              <Card className="p-6">

                {/* STEP 1 — DATE */}

                {step === 1 && (
                    <div className="animate-fade-in">
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-primary" />

                          <h2 className="text-xl font-heading font-bold">
                            Choisissez une date
                          </h2>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Sélectionnez le jour qui vous convient.
                        </p>
                      </div>

                      <AppointmentCalendar
                          mode="date"
                          selectedDate={selectedDate}
                          onDateSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedSlot(undefined);
                          }}
                          onSlotSelect={() => {}}
                      />

                      {selectedDate && (
                          <div className="mt-6 rounded-lg border bg-muted/30 p-4">
                            <div className="flex items-center gap-3">
                              <CalendarDays className="h-5 w-5 text-primary shrink-0" />

                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Date sélectionnée
                                </p>

                                <p className="text-sm font-medium capitalize">
                                  {format(
                                      selectedDate,
                                      'EEEE d MMMM yyyy',
                                      { locale: fr },
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                      )}

                      <div className="flex justify-end pt-6">
                        <Button
                            size="lg"
                            onClick={() => setStep(2)}
                            disabled={!selectedDate}
                        >
                          Choisir un créneau
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                )}

                {/* STEP 2 — SLOT */}

                {step === 2 && selectedDate && (
                    <div className="animate-fade-in">
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />

                          <h2 className="text-xl font-heading font-bold">
                            Choisissez votre créneau
                          </h2>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Sélectionnez l'horaire qui vous convient.
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/30 p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-primary shrink-0" />

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Date
                            </p>

                            <p className="text-sm font-medium capitalize">
                              {format(
                                  selectedDate,
                                  'EEEE d MMMM yyyy',
                                  { locale: fr },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <AppointmentCalendar
                          mode="slot"
                          selectedDate={selectedDate}
                          selectedSlot={selectedSlot}
                          onDateSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedSlot(undefined);
                          }}
                          onSlotSelect={(slot) => {
                            setSelectedSlot(slot);
                          }}
                      />

                      {selectedSlot && (
                          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />

                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Créneau sélectionné
                                </p>

                                <p className="font-medium">
                                  {formatSlotTime(selectedSlot.start)} —{' '}
                                  {formatSlotTime(selectedSlot.end)}
                                </p>

                                <p className="text-sm text-muted-foreground mt-1">
                                  {formatSlotDuration(
                                      selectedSlot.start,
                                      selectedSlot.end,
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                      )}

                      <div className="flex justify-between pt-6">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setStep(1)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Retour
                        </Button>

                        <Button
                            size="lg"
                            onClick={() => setStep(3)}
                            disabled={!selectedSlot}
                        >
                          Continuer
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                )}

                {/* STEP 3 — SUMMARY */}

                {step === 3 && selectedDate && selectedSlot && (
                    <div className="animate-fade-in">
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />

                          <h2 className="text-xl font-heading font-bold">
                            Récapitulatif
                          </h2>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Vérifiez votre rendez-vous et ajoutez une note si
                          nécessaire.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />

                              <span className="text-sm font-semibold">
                            Rendez-vous
                          </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-xs text-primary hover:underline"
                            >
                              Modifier
                            </button>
                          </div>

                          <p className="text-sm font-medium capitalize">
                            {format(
                                selectedDate,
                                'EEEE d MMMM yyyy',
                                { locale: fr },
                            )}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatSlotTime(selectedSlot.start)} —{' '}
                          {formatSlotTime(selectedSlot.end)}
                        </span>

                            <span className="flex items-center gap-1.5">
                          <Timer className="h-3.5 w-3.5" />
                              {formatSlotDuration(
                                  selectedSlot.start,
                                  selectedSlot.end,
                              )}
                        </span>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <User className="h-4 w-4 text-muted-foreground" />

                            <span className="text-sm font-semibold">
                          Vos informations
                        </span>
                          </div>

                          <div className="space-y-4">
                            <ReadonlyField
                                icon={User}
                                label="Nom"
                                value={fullName}
                            />

                            <ReadonlyField
                                icon={Phone}
                                label="Téléphone"
                                value={userPhone}
                            />
                          </div>

                          {!userPhone && (
                              <p className="mt-4 text-sm text-muted-foreground">
                                Aucun numéro de téléphone n'est associé à votre
                                compte. Merci de le renseigner depuis votre profil.
                              </p>
                          )}
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />

                            <Label
                                htmlFor="rdv-notes"
                                className="text-sm font-semibold"
                            >
                              Message / notes
                            </Label>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            Une précision à nous transmettre ?
                          </p>

                          <Textarea
                              id="rdv-notes"
                              rows={5}
                              maxLength={500}
                              value={notes}
                              onChange={(event) => {
                                setNotes(event.target.value);
                              }}
                              placeholder="Décrivez votre projet, vos envies, une couleur, une taille ou toute autre précision..."
                          />
                        </div>

                        {error && <ErrorMessage message={error} />}
                      </div>

                      <div className="flex justify-between pt-6">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setStep(2)}
                            disabled={isSubmitting}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Retour
                        </Button>

                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={
                                isSubmitting ||
                                !selectedSlot ||
                                !isCustomerReady
                            }
                        >
                          {isSubmitting
                              ? 'Confirmation...'
                              : 'Confirmer le rendez-vous'}
                        </Button>
                      </div>
                    </div>
                )}
              </Card>

              {/* RIGHT — MES RENDEZ-VOUS */}

              <aside className="lg:sticky lg:top-8 lg:self-start">
                <AppointmentsPanel />
              </aside>
            </div>
          </div>
        </main>

        <Footer />

        {/* AUTH MODAL */}

        {!isAuthenticated && !isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

              <Card className="relative w-full max-w-md p-6 shadow-2xl animate-scale-in">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <LockKeyhole className="h-7 w-7 text-primary" />
                  </div>

                  <h2 className="text-2xl font-heading font-bold">
                    Encore une petite étape 💗
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Pour prendre rendez-vous, connectez-vous à votre compte
                    ou créez-en un gratuitement.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                      size="lg"
                      className="w-full"
                      onClick={handleLogin}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Se connecter
                  </Button>

                  <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={handleRegister}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer mon compte
                  </Button>
                </div>
              </Card>
            </div>
        )}
      </div>
  );
};

export default Appointments;