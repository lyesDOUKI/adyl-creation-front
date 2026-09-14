import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/ui/cart/useCart';
import { useAuth } from '@/ui/hooks/useAuth';
import { formatPrice } from '@/domain/shared/formatPrice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  Building2,
  LockKeyhole,
  UserPlus,
  LogIn,
  ShieldCheck,
  Check,
  MessageSquare,
  ClipboardList,
} from 'lucide-react';
import { useCreateOrder } from '@/ui/hooks/useCreateOrder';
import { useRegisterCustomer } from '@/ui/hooks/useRegisterCustomer';
import { ErrorMessage } from '@/components/ui/error-message';
import {
  CheckoutWizardFormValues,
  toCreateOrderData,
  toOrderFormValues,
} from '@/ui/forms/createOrderMapper';
import { ReadonlyField } from '@/components/ui/ReadonlyField.tsx';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { AddressSuggestion } from '@/ui/hooks/useAddressAutocomplete';

const defaultForm: CheckoutWizardFormValues = {
  address: '',
  city: '',
  message: '',
  selectedAddress: null,
};

type StepId = 1 | 2 | 3;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Vos coordonnées' },
  { id: 2, label: 'Votre commande' },
  { id: 3, label: 'Récapitulatif' },
];

const SummaryRow = ({
                      label,
                      value,
                    }: {
  label: string;
  value: React.ReactNode;
}) => (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>

      <dd className="min-w-0 flex-1 break-words text-right text-foreground">
        {value}
      </dd>
    </div>
);

const Checkout = () => {
  const { items, total, clearCart } = useCart();

  const { isAuthenticated, isLoading, login, register, user } = useAuth();

  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<StepId>(1);
  const [form, setForm] = useState<CheckoutWizardFormValues>(defaultForm);

  const {
    isSubmitting,
    error: orderError,
    submitAction,
  } = useCreateOrder();

  const {
    isSubmitting: isRegistering,
    error: customerError,
    registerCustomer,
  } = useRegisterCustomer();

  const registeredCustomerRef = useRef<string | null>(null);
  const registeringCustomerRef = useRef<string | null>(null);
  const registerCustomerRef = useRef(registerCustomer);

  useEffect(() => {
    registerCustomerRef.current = registerCustomer;
  }, [registerCustomer]);

  const userEmail = user?.email;
  const userPhone = user?.phone ?? '';

  const fullName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(' ');

  useEffect(() => {
    if (!isAuthenticated || isLoading || !userEmail || !userPhone) {
      return;
    }

    if (registeredCustomerRef.current === userEmail) {
      return;
    }

    if (registeringCustomerRef.current === userEmail) {
      return;
    }

    registeringCustomerRef.current = userEmail;

    const registerCurrentCustomer = async () => {
      try {
        await registerCustomerRef.current({
          email: userEmail,
          phone: userPhone,
        });

        registeredCustomerRef.current = userEmail;
      } catch {
        registeringCustomerRef.current = null;
      }
    };

    registerCurrentCustomer();
  }, [isAuthenticated, isLoading, userEmail, userPhone]);

  const update =
      (field: keyof CheckoutWizardFormValues) =>
          (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) =>
              setForm(currentForm => ({
                ...currentForm,
                [field]: e.target.value,
              }));

  const handleAddressTextChange = (text: string) => {
    setForm(current => {
      const stillMatchesSelection =
          current.selectedAddress !== null &&
          text === current.selectedAddress.label;

      return {
        ...current,
        address: text,
        selectedAddress: stillMatchesSelection ? current.selectedAddress : null,
        city: stillMatchesSelection ? current.city : '',
      };
    });
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setForm(current => ({
      ...current,
      address: suggestion.label,
      city: suggestion.city,
      selectedAddress: suggestion,
    }));
  };

  const isStep1Valid = Boolean(userPhone);

  const isStep2Valid = Boolean(form.selectedAddress);

  const isCustomerReady =
      Boolean(user?.email) &&
      Boolean(userPhone) &&
      registeredCustomerRef.current === user?.email &&
      !isRegistering;

  const submitOrder = async () => {
    if (!isCustomerReady || !form.selectedAddress) {
      return;
    }

    const orderFormValues = toOrderFormValues(form);
    const order = await submitAction(toCreateOrderData(orderFormValues, items));

    if (!order) {
      return;
    }

    setSubmitted(true);
    clearCart();
  };

  const handleLogin = async () => {
    await login();
  };

  const handleRegister = async () => {
    await register();
  };

  const goToStep = (target: StepId) => {
    if (target === 2 && !isStep1Valid) {
      return;
    }

    if (target === 3 && (!isStep1Valid || !isStep2Valid)) {
      return;
    }

    setStep(target);
  };

  const handleNext = () => {
    if (step === 3) {
      return;
    }

    goToStep((step + 1) as StepId);
  };

  const handleBack = () => {
    if (step === 1) {
      return;
    }

    setStep((step - 1) as StepId);
  };

  const handleFinalSubmit = async () => {
    await submitOrder();
  };

  if (items.length === 0 && !submitted) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-0">
            <div className="text-center space-y-4">
              <p className="text-xl text-muted-foreground">
                Votre panier est vide
              </p>

              <Button onClick={() => navigate('/')}>
                Retour à la boutique
              </Button>
            </div>
          </div>

          <Footer />
        </div>
    );
  }

  if (submitted) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-0">
            <Card className="p-6 sm:p-8 text-center space-y-4 max-w-md animate-scale-in shadow-glow">
              <div className="text-5xl animate-heartbeat">💗</div>

              <h2 className="text-2xl font-heading font-bold">
                Demande envoyée !
              </h2>

              <p className="text-muted-foreground">
                Merci pour votre demande. Nous reviendrons vers vous très
                prochainement pour confirmer les détails et convenir de la suite.
              </p>

              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={() => navigate('/')}>
                  Retour à la boutique
                </Button>
              </div>
            </Card>
          </div>

          <Footer />
        </div>
    );
  }

  const mappedOrderValues = toOrderFormValues(form);

  return (
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />

        <main className="flex-1 container px-4 sm:px-6 py-6 pb-24 md:pb-6 animate-fade-in">
          <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </button>

          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <ol className="flex items-center">
              {STEPS.map((s, index) => {
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;

                const isClickable =
                    s.id === 1 ||
                    (s.id === 2 && isStep1Valid) ||
                    (s.id === 3 && isStep1Valid && isStep2Valid) ||
                    s.id < step;

                return (
                    <li
                        key={s.id}
                        className="flex items-center flex-1 last:flex-none"
                    >
                      <button
                          type="button"
                          onClick={() => isClickable && goToStep(s.id)}
                          disabled={!isClickable}
                          className="flex items-center gap-2 sm:gap-2.5 group disabled:cursor-not-allowed"
                      >
                    <span
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                            isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : isCurrent
                                    ? 'bg-primary/10 text-primary ring-2 ring-primary'
                                    : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : s.id}
                    </span>

                        <span
                            className={`text-xs sm:text-sm font-medium hidden xs:block sm:block whitespace-nowrap transition-colors ${
                                isCurrent ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                        >
                      {s.label}
                    </span>
                      </button>

                      {index < STEPS.length - 1 && (
                          <div
                              className={`h-px flex-1 mx-2 sm:mx-3 transition-colors ${
                                  step > s.id ? 'bg-primary' : 'bg-border'
                              }`}
                          />
                      )}
                    </li>
                );
              })}
            </ol>
          </div>

          <div className="grid md:grid-cols-[1fr_340px] gap-5 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            <Card className="p-4 sm:p-6 order-2 md:order-1">
              {step === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-1">
                      Vos coordonnées
                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">
                      Pour qu'on sache où vous livrer et vous recontacter.
                    </p>

                    <div className="space-y-5">
                      <ReadonlyField
                          icon={User}
                          label="Nom complet"
                          value={fullName}
                      />

                      <ReadonlyField
                          icon={Mail}
                          label="Email"
                          value={user?.email ?? ''}
                      />

                      <ReadonlyField
                          icon={Phone}
                          label="Téléphone"
                          value={userPhone}
                      />
                    </div>

                    {!userPhone && (
                        <p className="pt-4 text-sm text-muted-foreground">
                          Aucun numéro de téléphone n'est associé à votre compte.
                          Merci de le renseigner depuis votre profil.
                        </p>
                    )}

                    {customerError && (
                        <div className="pt-4">
                          <ErrorMessage message={customerError} />
                        </div>
                    )}

                    <div className="flex justify-end pt-6">
                      <Button
                          size="lg"
                          onClick={handleNext}
                          disabled={!isStep1Valid}
                          className="w-full sm:w-auto"
                      >
                        Continuer
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
              )}

              {step === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-1">
                      Votre commande
                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">
                      Où livrer, et une précision si vous en avez besoin.
                    </p>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <Label
                            htmlFor="address"
                            className="text-primary text-sm font-medium"
                        >
                          Adresse
                        </Label>

                        <AddressAutocomplete
                            id="address"
                            value={form.address}
                            onChangeText={handleAddressTextChange}
                            onSelect={handleAddressSelect}
                            placeholder="12 rue des Lilas"
                            hasSelection={Boolean(form.selectedAddress)}
                        />

                        <p className="text-xs text-muted-foreground pt-1">
                          Choisissez une adresse dans la liste proposée.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <ReadonlyField
                            label={'Ville'}
                            icon={Building2}
                            value={form.city || 'Sélectionnez une adresse ci-dessus'}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                            htmlFor="message"
                            className="text-primary text-sm font-medium"
                        >
                          Message (optionnel)
                        </Label>

                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                          <Textarea
                              id="message"
                              rows={5}
                              value={form.message}
                              onChange={update('message')}
                              placeholder="Précisions, personnalisation, questions..."
                              className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6">
                      <Button
                          size="lg"
                          variant="outline"
                          onClick={handleBack}
                          className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                      </Button>

                      <Button
                          size="lg"
                          onClick={handleNext}
                          disabled={!isStep2Valid}
                          className="w-full sm:w-auto"
                      >
                        Continuer
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
              )}

              {step === 3 && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-1">
                      Récapitulatif
                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">
                      Vérifiez vos informations avant d'envoyer votre demande.
                    </p>

                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 space-y-2.5 overflow-hidden">
                        <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        Coordonnées
                      </span>
                        </div>

                        <dl className="text-sm space-y-1.5">
                          <SummaryRow label="Nom" value={fullName} />
                          <SummaryRow label="Email" value={user?.email} />
                          <SummaryRow label="Téléphone" value={userPhone} />
                        </dl>
                      </div>

                      <div className="rounded-lg border p-4 space-y-2.5 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold flex items-center gap-2 min-w-0">
                        <ClipboardList className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        Commande
                      </span>

                          <button
                              type="button"
                              onClick={() => setStep(2)}
                              className="text-xs text-primary hover:underline shrink-0"
                          >
                            Modifier
                          </button>
                        </div>

                        <dl className="text-sm space-y-1.5">
                          <SummaryRow
                              label="Adresse"
                              value={`${mappedOrderValues.address}, ${mappedOrderValues.city}`}
                          />
                        </dl>

                        <p className="text-sm text-muted-foreground pt-1 break-words">
                          {mappedOrderValues.message ? mappedOrderValues.message : 'Aucun message'}
                        </p>
                      </div>
                    </div>

                    {customerError && (
                        <div className="pt-4">
                          <ErrorMessage message={customerError} />
                        </div>
                    )}

                    {orderError && (
                        <div className="pt-4">
                          <ErrorMessage message={orderError} />
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6">
                      <Button
                          size="lg"
                          variant="outline"
                          onClick={handleBack}
                          disabled={isSubmitting || isRegistering}
                          className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                      </Button>

                      <Button
                          size="lg"
                          onClick={handleFinalSubmit}
                          disabled={
                              isSubmitting ||
                              isRegistering ||
                              !isCustomerReady ||
                              !form.selectedAddress
                          }
                          className="w-full sm:w-auto"
                      >
                        {isRegistering
                            ? 'Préparation...'
                            : isSubmitting
                                ? 'Envoi en cours'
                                : 'Envoyer ma demande'}
                      </Button>
                    </div>
                  </div>
              )}
            </Card>

            <Card className="p-4 sm:p-5 h-fit order-1 md:order-2">
              <h3 className="font-heading font-bold text-lg mb-4">
                Votre panier
              </h3>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                    <div
                        key={`${item.product.id}-${item.selectedColor ?? 'default'}`}
                        className="flex items-center gap-3"
                    >
                      <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>

                        <p className="text-xs text-muted-foreground truncate">
                          {item.selectedColor && (
                              <>Couleur : {item.selectedColor} · </>
                          )}
                          x{item.quantity}
                        </p>
                      </div>

                      <span className="text-sm font-semibold shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                    </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-3">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>

                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  Les modalités de livraison seront précisées lors de notre
                  prise de contact.
                </p>
              </div>
            </Card>
          </div>
        </main>

        <Footer />

        {!isAuthenticated && !isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

              <Card className="relative w-full max-w-md p-5 sm:p-6 shadow-2xl animate-scale-in">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <LockKeyhole className="h-7 w-7 text-primary" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-heading font-bold">
                    Encore une petite étape 💗
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Pour envoyer votre demande, connectez-vous à votre compte
                    ou créez-en un gratuitement.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <Button size="lg" className="w-full" onClick={handleLogin}>
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

                <div className="mt-5 flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />

                  <p className="text-xs text-muted-foreground text-left">
                    Votre compte nous permet de retrouver facilement vos
                    demandes et de vous contacter concernant votre commande.
                  </p>
                </div>
              </Card>
            </div>
        )}
      </div>
  );
};

export default Checkout;