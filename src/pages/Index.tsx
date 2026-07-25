import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/ui/hooks/useProducts';
import type { ProductCategory } from '@/domain/product/Product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search, LayoutGrid, Heart, Sparkles, Home, Shirt, Palette } from 'lucide-react';

const categories: { value: ProductCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Tous', icon: LayoutGrid },
  { value: 'accessoire', label: 'Accessoires', icon: Sparkles },
  { value: 'decoration', label: 'Décoration', icon: Home },
  { value: 'bebe', label: 'Bébé', icon: Shirt },
  { value: 'personnalise', label: 'Personnalisé', icon: Palette },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products, isLoading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 md:py-24 px-4 relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 gradient-hero opacity-[0.06]" />
        <div className="absolute inset-0 gradient-soft opacity-40" />

        {/* Floating hearts */}
        <div className="floating-hearts"><span /></div>

        <div className="container max-w-4xl text-center relative z-10">
          {/* Logo Hero - Grand et centré */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative">
              {/* Glow effect derrière le logo */}
              <div className="absolute inset-0 gradient-hero blur-3xl opacity-30 animate-pulse-soft" />

              {/* Logo container */}
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-card shadow-glow border-4 border-primary/20 overflow-hidden hover:scale-105 hover:border-primary/40 transition-all duration-500">
                <img
                  src="/images/logo.png"
                  alt="Adyl création"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Coeur sous le logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-3xl animate-heartbeat">💗</span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold animate-fade-in mb-5">
            Créations{' '}
            <span className="shimmer-text">Uniques</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up leading-relaxed mb-10 px-4">
            Chaque pièce est crochetée à la main avec{' '}
            <span className="text-primary font-semibold">amour</span> et attention aux détails 💗
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto animate-slide-up px-4">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            <Input
              placeholder="Que cherchez-vous ? 💗"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 h-12 rounded-full border-primary/20 bg-card shadow-warm focus:shadow-glow focus:border-primary/40 transition-all duration-300 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Catalog */}
      <main className="flex-1 container pb-16 pt-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2.5 mb-6 justify-center px-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <Button
                key={cat.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`rounded-full gap-1.5 transition-all duration-200 ${isActive ? 'shadow-warm' : 'hover:border-primary/40 hover:text-primary'
                  }`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-10 text-center font-medium">
          {filteredProducts.length} création{filteredProducts.length > 1 ? 's' : ''} {filteredProducts.length > 1 ? 'trouvées' : 'trouvée'}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 px-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="stagger-child">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground space-y-3">
            <span className="text-5xl block">💔</span>
            <p className="text-base">Aucun article trouvé...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;