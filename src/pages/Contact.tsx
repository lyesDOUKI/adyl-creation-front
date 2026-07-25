import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MessageCircle } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message envoyé !', description: 'Nous vous répondrons dans les plus brefs délais.' });
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-4xl animate-fade-in">
        <h1 className="text-3xl font-heading font-bold mb-2">Contactez-nous</h1>
        <p className="text-muted-foreground mb-8">Une question ? N'hésitez pas à nous écrire !</p>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nom</Label>
              <Input id="contact-name" required value={form.name} onChange={update('name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" required value={form.email} onChange={update('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Téléphone</Label>
              <Input id="contact-phone" value={form.phone} onChange={update('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" required rows={5} value={form.message} onChange={update('message')} />
            </div>
            <Button type="submit" size="lg" className="w-full">Envoyer</Button>
          </form>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-heading font-semibold text-lg">Nos coordonnées</h3>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>0555 12 34 56</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>contact@Adyl._creation.dz</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span>@Adyl._creation sur Instagram</span>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-2">Horaires</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Samedi — Jeudi : 9h - 17h</p>
                <p>Vendredi : Fermé</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
