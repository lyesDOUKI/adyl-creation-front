import { Link } from 'react-router-dom';

export const Footer = () => (
    <footer
        className="border-t border-primary/10 pt-12 pb-28 md:pb-12 mt-16 relative overflow-hidden"
        style={{ paddingBottom: 'max(7rem, env(safe-area-inset-bottom))' }}
    >
      <div className="absolute inset-0 gradient-soft" />
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      <div className="container relative">
        <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="h-8 w-8 rounded-xl gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground text-sm">♥</span>
              </div>
              <p className="font-heading text-lg font-bold text-primary">Adyl création</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Créations artisanales au crochet<br />Fait main avec pleins d'amour ♥
            </p>
          </div>

          {/* Sur mobile, la bottom tab bar couvre déjà la navigation :
            pas la peine de la répéter ici. */}
          <div className="hidden md:block">
            <p className="font-heading font-semibold mb-3 text-foreground">Navigation</p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors duration-200">♥ Boutique</Link>
              <Link to="/suivi" className="hover:text-primary transition-colors duration-200">♥ Commandes</Link>
              <Link to="/rendez-vous" className="hover:text-primary transition-colors duration-200">♥ Rendez-vous</Link>
            </div>
          </div>

          <div>
            <p className="font-heading font-semibold mb-3 text-foreground">Contact</p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                📞{' '}
                <a href="tel:+33759247369" className="hover:text-primary transition-colors duration-200">
                  +33 7 59 24 73 69
                </a>
              </p>
              <p>
                ✉️{' '}
                <a href="mailto:contact@Adyl._creation.fr" className="hover:text-primary transition-colors duration-200 break-all">
                  contact@Adyl._creation.fr
                </a>
              </p>
              <p>
                📷{' '}
                <a
                    href="https://instagram.com/Adyl._creation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors duration-200"
                >
                  @Adyl._creation
                </a>
              </p>
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