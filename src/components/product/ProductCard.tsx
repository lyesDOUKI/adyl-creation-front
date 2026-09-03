import { useState } from 'react';
import type { Product } from '@/domain/product/Product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '@/domain/shared/formatPrice';
import { useCart } from '@/ui/cart/useCart';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [liked, setLiked] = useState(false);

  return (
      <Card className="group overflow-hidden shadow-card hover-lift border-primary/5 hover:border-primary/20 bg-card h-full flex flex-col">
        <div
            className="aspect-[4/3] relative overflow-hidden cursor-pointer"
            onClick={() => navigate(`/produit/${product.id}`)}
        >
          <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <button
              className={cn(
                  'absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm',
                  liked
                      ? 'bg-primary text-primary-foreground shadow-glow scale-110'
                      : 'bg-card/90 text-muted-foreground hover:bg-primary/10 hover:text-primary',
              )}
              onClick={e => {
                e.stopPropagation();
                setLiked(!liked);
              }}
          >
            <Heart
                className={cn(
                    'h-4 w-4 transition-all',
                    liked && 'fill-current animate-heartbeat',
                )}
            />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3
              className="font-heading font-semibold text-foreground cursor-pointer hover:text-primary transition-colors duration-200 line-clamp-2 mb-2.5"
              onClick={() => navigate(`/produit/${product.id}`)}
          >
            {product.name}
          </h3>

          <p className="text-lg font-bold text-primary mb-2.5">
            {formatPrice(product.price)}
          </p>

          {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                <span className="text-xs text-muted-foreground">Couleur:</span>

                {product.colors.map(color => (
                    <button
                        key={color}
                        className={cn(
                            'text-xs px-2.5 py-1 rounded-full border transition-all duration-200',
                            selectedColor === color
                                ? 'border-primary bg-primary/10 text-primary font-medium shadow-warm'
                                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
                        )}
                        onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                ))}
              </div>
          )}

          <div className="flex-1" />

          <Button
              className="w-full group/btn gradient-hero hover:shadow-soft border-0 transition-all duration-300"
              size="sm"
              onClick={() => addItem(product, selectedColor)}
          >
            <ShoppingBag className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Ajouter au panier
          </Button>
        </div>
      </Card>
  );
};