import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/ui/hooks/useOrder';
import { formatPrice } from '@/domain/shared/formatPrice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, MessageSquare } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import type { OrderStatus } from '@/domain/order/OrderStatus';

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptée',
  DELIVERED: 'Livrée',
  REJECTED: 'Refusée',
};

const statusVariants: Record<
    OrderStatus,
    'default' | 'secondary' | 'outline'
> = {
  PENDING: 'outline',
  ACCEPTED: 'default',
  DELIVERED: 'secondary',
  REJECTED: 'outline',
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!order) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center space-y-4 max-w-md">
              <p className="text-xl text-muted-foreground">
                Commande introuvable
              </p>

              <Button onClick={() => navigate('/suivi')}>
                Voir toutes les commandes
              </Button>
            </Card>
          </div>

          <Footer />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container py-8 max-w-3xl animate-fade-in">
          <button
              onClick={() => navigate('/suivi')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux commandes
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-heading font-bold">{order.orderReference}</h1>

                <Badge variant={statusVariants[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Passée le{' '}
                {order.createdAt.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_280px] gap-6">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="font-heading font-bold text-lg mb-5">
                  Suivi de la commande
                </h2>

                <OrderTimeline steps={order.steps} />
              </Card>

              <Card className="p-6">
                <h2 className="font-heading font-bold text-lg mb-4">
                  Articles commandés
                </h2>

                <div className="space-y-4">
                  {order.items.map((item, i) => {
                    const hasDiscount = item.discountAmount > 0;

                    return (
                        <div
                            key={`${item.productId}-${i}`}
                            className="flex items-center gap-4"
                        >
                          {item.imageUrl && (
                              <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                              />
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{item.productName}</p>

                            <p className="text-sm text-muted-foreground">
                              Quantité : {item.quantity}
                              {item.chosenColor ? ` · ${item.chosenColor}` : ''}
                            </p>

                            {hasDiscount && (
                                <p className="text-xs text-muted-foreground">
                            <span className="line-through">
                              {formatPrice(item.subtotalBeforeDiscount)}
                            </span>{' '}
                                  <span className="text-primary">
                              −{formatPrice(item.discountAmount)}
                            </span>
                                </p>
                            )}
                          </div>

                          <span className="font-semibold text-primary">
                        {formatPrice(item.totalAmount)}
                      </span>
                        </div>
                    );
                  })}
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>

                  <span className="text-primary">
                  {formatPrice(order.total)}
                </span>
                </div>
              </Card>
            </div>

            <Card className="p-5 h-fit space-y-4">
              <h3 className="font-heading font-bold text-base">Informations</h3>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Référence</dt>

                  <dd className="font-medium break-all">{order.orderReference}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Articles</dt>

                  <dd className="font-medium">
                    {order.lineCount} ligne{order.lineCount > 1 ? 's' : ''} ·{' '}
                    {order.totalQuantity} unité
                    {order.totalQuantity > 1 ? 's' : ''}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Dernière mise à jour</dt>

                  <dd className="font-medium">
                    {order.updatedAt.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>

              {order.message && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-primary" />

                      <span className="font-medium text-sm">Votre message</span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {order.message}
                    </p>
                  </div>
              )}
            </Card>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default OrderDetail;