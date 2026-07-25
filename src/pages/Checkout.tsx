import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/ui/cart/useCart';
import { formatPrice } from '@/domain/shared/formatPrice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, User, Phone, Mail, Building2, MapPin } from 'lucide-react';
import { useCreateOrder } from '@/ui/hooks/useCreateOrder';
import { ErrorMessage } from '@/components/ui/error-message';
import { OrderFormValues, toCreateOrderData } from '@/ui/forms/createOrderMapper';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<OrderFormValues>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    message: '',
  });
  const { isSubmitting, error, submitAction } = useCreateOrder();
  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = await submitAction(toCreateOrderData(form, items));

    if (!order) return;


    setSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">Votre panier est vide</p>
            <Button onClick={() => navigate('/')}>Retour à la boutique</Button>
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
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="p-8 text-center space-y-4 max-w-md animate-scale-in shadow-glow">
            <div className="text-5xl animate-heartbeat">💗</div>
            <h2 className="text-2xl font-heading font-bold">Demande envoyée !</h2>
            <p className="text-muted-foreground">
              Merci pour votre demande. Nous reviendrons vers vous très prochainement
              pour confirmer les détails et convenir de la suite.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={() => navigate('/')}>Retour à la boutique</Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 animate-fade-in">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </button>

        <div className="grid md:grid-cols-[1fr_340px] gap-8 max-w-4xl mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-heading font-bold mb-1">Vos coordonnées</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Laissez-nous vos informations, nous reviendrons vers vous pour la suite.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-primary text-sm font-medium">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" required value={form.name} onChange={update('name')} placeholder="Votre nom" className="pl-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-primary text-sm font-medium">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" required value={form.phone} onChange={update('phone')} placeholder="0XX XX XX XX XX" className="pl-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-primary text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={form.email} onChange={update('email')} placeholder="vous@exemple.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-primary text-sm font-medium">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="address" type="text" value={form.address} onChange={update('address')} placeholder="12 rue des Lilas" className="pl-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-primary text-sm font-medium">Ville</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="city" type="text" value={form.city} onChange={update('city')} placeholder="Avignon" className="pl-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-primary text-sm font-medium">Message (optionnel)</Label>
                <Textarea id="message" rows={4} value={form.message} onChange={update('message')} placeholder="Précisions, personnalisation, questions..." />
              </div>

              {error && <ErrorMessage message={error} />}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours" : "Envoyer ma demande"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </Card>

          <Card className="p-5 h-fit">
            <h3 className="font-heading font-bold text-lg mb-4">Votre panier</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.imageUrl} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t pt-3">
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Les modalités de livraison seront précisées lors de notre prise de contact.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
