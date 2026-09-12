import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Eye,
  CalendarDays,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCart } from '@/ui/cart/useCart';
import { CartSheet } from '@/components/cart/CartSheet';
import { AuthButtons } from '@/components/auth/AuthButtons';

const navLinks = [
  { to: '/', label: 'Boutique', icon: Heart },
  { to: '/suivi', label: 'Commandes', icon: Eye },
  { to: '/rendez-vous', label: 'Rendez-vous', icon: CalendarDays },
];

export const Header = () => {
  const { itemCount, cartOpen, setCartOpen } = useCart();
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);

  return (
      <>
        <header className="sticky top-0 z-50 border-b border-primary/10 bg-card/85 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-11 w-11 rounded-2xl gradient-hero flex items-center justify-center shadow-glow group-hover:shadow-soft transition-all duration-300 group-hover:scale-105">
                <span className="text-primary-foreground text-lg">♥</span>
              </div>
              <div className="leading-tight">
                <span className="font-heading text-lg font-bold text-foreground tracking-tight">Adyl création</span>
                <span className="block text-[10px] text-primary/60 font-medium tracking-widest uppercase">Crochet fait main</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                            ? 'bg-primary/12 text-primary shadow-warm'
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <AuthButtons />
              </div>

              {/* Sur mobile, le panier reste dans le header : c'est un
                  geste qu'on attend en haut, pas dans la tab bar du bas. */}
              <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full gradient-hero text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-glow animate-scale-in">
                  {itemCount}
                </span>
                )}
              </Button>
            </div>
          </div>

          <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
        </header>

        {/* ============================================================
         * BOTTOM TAB BAR — mobile uniquement.
         * ============================================================ */}

        <nav
            className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-primary/10 bg-card/95 backdrop-blur-xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-4 h-16">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                  <Link
                      key={link.to}
                      to={link.to}
                      className="flex flex-col items-center justify-center gap-1 group"
                  >
                    <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                            isActive
                                ? 'bg-primary/12 text-primary'
                                : 'text-muted-foreground group-active:bg-primary/5'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span
                        className={`text-[10px] font-medium leading-none transition-colors ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                      {link.label}
                    </span>
                  </Link>
              );
            })}

            <button
                type="button"
                onClick={() => setAccountOpen(true)}
                className="flex flex-col items-center justify-center gap-1 group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground group-active:bg-primary/5 transition-all duration-200">
                <User className="h-5 w-5" />
              </span>

              <span className="text-[10px] font-medium leading-none text-muted-foreground">
                Compte
              </span>
            </button>
          </div>
        </nav>

        {/* Sheet "Compte" — remplace l'ancien menu hamburger sur mobile. */}

        <Sheet open={accountOpen} onOpenChange={setAccountOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl border-t-primary/10 pb-8">
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="h-10 w-10 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground">♥</span>
              </div>
              <span className="font-heading text-lg font-bold text-primary">Mon compte</span>
            </div>

            <div onClick={() => setAccountOpen(false)}>
              <AuthButtons />
            </div>
          </SheetContent>
        </Sheet>
      </>
  );
};