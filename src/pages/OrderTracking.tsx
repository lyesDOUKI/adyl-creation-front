import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/ui/hooks/useOrders';
import { formatPrice } from '@/domain/shared/formatPrice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ChevronRight } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  in_progress: 'En fabrication',
  shipped: 'Expédiée',
  delivered: 'Livrée',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
  pending: 'outline',
  confirmed: 'secondary',
  in_progress: 'default',
  shipped: 'default',
  delivered: 'secondary',
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <Spinner />
    )
  }
  if (error) {
    return (
      <ErrorMessage message={error} />
    )
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-2xl animate-fade-in">
        <h1 className="text-3xl font-heading font-bold mb-2">Mes commandes</h1>
        <p className="text-muted-foreground mb-8">
          Retrouvez l'ensemble de vos commandes et suivez leur avancement.
        </p>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Aucune commande pour le moment</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Card
                key={order.id}
                className="p-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
                onClick={() => navigate(`/suivi/${order.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* First item image */}
                  {order.items[0]?.imageUrl && (
                    <img
                      src={order.items[0].imageUrl}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-sm">{order.id}</span>
                      <Badge variant={statusVariants[order.status]} className="text-[10px]">
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''} · {order.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                    <span className="font-semibold text-primary text-sm">{formatPrice(order.total)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
