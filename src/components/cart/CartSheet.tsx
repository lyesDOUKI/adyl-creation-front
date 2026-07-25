import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/ui/cart/useCart';
import { formatPrice } from '@/domain/shared/formatPrice';
import { useNavigate } from 'react-router-dom';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/commande');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md border-l-primary/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-heading flex items-center gap-2 text-lg">
            <div className="h-8 w-8 rounded-xl gradient-hero flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            Mon Panier
            {itemCount > 0 && (
              <span className="h-6 w-6 rounded-full gradient-hero text-primary-foreground text-xs font-bold flex items-center justify-center shadow-glow">
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="text-5xl animate-pulse-soft">💗</span>
            <p className="text-muted-foreground">Votre panier est vide</p>
            <p className="text-xs text-muted-foreground">Ajoutez des créations faites avec ♥</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 items-start p-2 rounded-xl hover:bg-primary/5 transition-colors duration-200">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-xl object-cover flex-shrink-0 shadow-warm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm">{item.product.name}</p>
                    {item.selectedColor && (
                      <p className="text-xs text-muted-foreground">Couleur: {item.selectedColor}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-0.5">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-bold w-4 text-center text-primary">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-xs text-muted-foreground">Calculée à l'étape suivante</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-primary/10">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <Button className="w-full gradient-hero border-0 hover:shadow-soft transition-all duration-300" size="lg" onClick={handleCheckout}>
                <Heart className="h-4 w-4 mr-2 fill-current" />
                Commander <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <button
                onClick={clearCart}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
