import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="border-t border-primary/10 py-12 mt-16 relative overflow-hidden">
    <div className="absolute inset-0 gradient-soft" />
    <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
    <div className="container relative">
      <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div>
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <div className="h-8 w-8 rounded-xl gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground text-sm">♥</span>
            </div>
            <p className="font-heading text-lg font-bold text-primary">Adyl création</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Créations artisanales au crochet<br />Fait main avec pleins d'amour ♥
          </p>
        </div>
        <div>
          <p className="font-heading font-semibold mb-3 text-foreground">Navigation</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors duration-200">♥ Boutique</Link>
            <Link to="/rendez-vous" className="hover:text-primary transition-colors duration-200">♥ Rendez-vous</Link>
            <Link to="/suivi" className="hover:text-primary transition-colors duration-200">♥ Suivi de vos commandes</Link>
            <Link to="/contact" className="hover:text-primary transition-colors duration-200">♥ Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-heading font-semibold mb-3 text-foreground">Contact</p>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>📞 +33759247369</p>
            <p>✉️ contact@Adyl._creation.fr</p>
            <p>📷 @Adyl._creation</p>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 pt-6 border-t border-primary/10">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Adyl création · Fait avec ♥
        </p>
      </div>
    </div>
  </footer>
);
