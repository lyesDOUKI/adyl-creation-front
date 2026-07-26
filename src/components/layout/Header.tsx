import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, Heart, Eye, MessageSquare, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/ui/cart/useCart';
import { CartSheet } from '@/components/cart/CartSheet';

const navLinks = [
  { to: '/', label: 'Boutique', icon: Heart },
  { to: '/contact', label: 'Contact', icon: MessageSquare },
];

export const Header = () => {
  const { itemCount, cartOpen, setCartOpen } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r-primary/10">
              <div className="flex items-center gap-3 mb-10 mt-4">
                <div className="h-10 w-10 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                  <span className="text-primary-foreground">♥</span>
                </div>
                <span className="font-heading text-xl font-bold text-primary">Adyl création</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-10 text-center text-sm text-muted-foreground">
                Fait avec ♥
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
};
