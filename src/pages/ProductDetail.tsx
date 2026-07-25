import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '@/ui/hooks/useProduct';
import { formatPrice } from '@/domain/shared/formatPrice';
import { useCart } from '@/ui/cart/useCart';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, CalendarDays, Heart, Star, Minus, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { NotFound } from '@/components/ui/not-found';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isLoading, error } = useProduct(id || '');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <NotFound />;
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">Produit introuvable</p>
            <Button variant="outline" onClick={() => navigate('/')}>Retour à la boutique</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedColor || product.colors[0]);
    }
  };

  const totalPrice = product.price * quantity;

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

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors shadow-sm"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={cn('h-5 w-5', liked ? 'fill-primary text-primary' : 'text-muted-foreground')} />
            </button>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              {product.isCustomizable && (
                <Badge className="bg-success text-success-foreground hover:bg-success font-body text-xs">
                  ✨ Personnalisable
                </Badge>
              )}
              {product.inStock && (
                <Badge variant="outline" className="text-success border-success/30 font-body text-xs">
                  <Check className="h-3 w-3 mr-1" /> En stock
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-heading font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground text-sm">· {product.reviewCount} avis</span>
            </div>

            <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm">
                  Couleur : <span className="text-primary font-medium">{selectedColor || product.colors[0]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={cn(
                        'px-4 py-2 rounded-full border text-sm transition-all',
                        (selectedColor || product.colors[0]) === color
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm">Quantité</p>
              <div className="inline-flex items-center border rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to cart */}
            <Button size="lg" className="w-full text-base" onClick={handleAddToCart}>
              <ShoppingBag className="h-5 w-5 mr-2" /> Ajouter au panier
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Total : <span className="text-primary font-bold">{formatPrice(totalPrice)}</span>
            </p>

            {product.isCustomizable && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/rendez-vous')}
              >
                <CalendarDays className="h-5 w-5 mr-2" /> Prendre RDV pour personnaliser
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
