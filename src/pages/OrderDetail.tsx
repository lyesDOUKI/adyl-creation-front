import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/ui/hooks/useOrder';
import { formatPrice } from '@/domain/shared/formatPrice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  MessageSquare,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';
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

// Même code couleur/icône que la liste des commandes, pour que le
// statut se reconnaisse d'un écran à l'autre.
const statusIcons: Record<OrderStatus, typeof Clock> = {
  PENDING: Clock,
  ACCEPTED: CheckCircle2,
  DELIVERED: Truck,
  REJECTED: XCircle,
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'text-muted-foreground',
  ACCEPTED: 'text-primary-foreground',
  DELIVERED: 'text-primary',
  REJECTED: 'text-destructive border-destructive/30',
};

/* ============================================================
 * PAGE SHELL — Header/Footer restent visibles pendant le
 * chargement, en cas d'erreur ou si la commande est introuvable.
 * ============================================================ */

const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1 container px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 max-w-3xl animate-fade-in">
        {children}
      </main>

      <Footer />
    </div>
);

/* ============================================================
 * LOADING SKELETON
 * ============================================================ */

const OrderDetailSkeleton = () => (
    <>
      <div className="h-4 w-36 rounded bg-muted animate-pulse mb-6" />

      <div className="mb-8 space-y-2">
        <div className="h-7 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-56 max-w-full rounded bg-muted animate-pulse" />
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-5 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <div className="h-5 w-40 rounded bg-muted animate-pulse mb-5" />
            <div className="h-24 rounded bg-muted animate-pulse" />
          </Card>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="h-5 w-44 rounded bg-muted animate-pulse" />

            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl bg-muted animate-pulse" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                  </div>
                </div>
            ))}
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <div className="h-4 w-24 rounded bg-muted animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
          </div>
        </Card>
      </div>
    </>
);

/* ============================================================
 * PAGE
 * ============================================================ */

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
        <PageShell>
          <OrderDetailSkeleton />
        </PageShell>
    );
  }

  if (error) {
    return (
        <PageShell>
          <ErrorMessage message={error} />
        </PageShell>
    );
  }

  if (!order) {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Header />

          <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-0">
            <Card className="p-6 sm:p-8 text-center space-y-4 max-w-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="text-lg sm:text-xl text-muted-foreground">
                Commande introuvable
              </p>

              <Button onClick={() => navigate('/suivi')} className="w-full sm:w-auto">
                Voir toutes les commandes
              </Button>
            </Card>
          </div>

          <Footer />
        </div>
    );
  }

  const StatusIcon = statusIcons[order.status];

  return (
      <PageShell>
        <button
            onClick={() => navigate('/suivi')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux commandes
        </button>

        <div className="flex items-start justify-between flex-wrap gap-3 mb-6 sm:mb-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl font-heading font-bold break-words">
                {order.orderReference}
              </h1>

              <Badge
                  variant={statusVariants[order.status]}
                  className={`gap-1 shrink-0 ${statusColors[order.status]}`}
              >
                <StatusIcon className="h-3 w-3" />
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

        <div className="grid gap-5 sm:gap-6 md:grid-cols-[1fr_280px]">
          <div className="space-y-5 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="font-heading font-bold text-lg mb-5">
                Suivi de la commande
              </h2>

              <OrderTimeline steps={order.steps} />
            </Card>

            <Card className="p-4 sm:p-6">
              <h2 className="font-heading font-bold text-lg mb-4">
                Articles commandés
              </h2>

              <div className="space-y-4">
                {order.items.map((item, i) => {
                  const hasDiscount = item.discountAmount > 0;

                  return (
                      <div
                          key={`${item.productId}-${i}`}
                          className="flex items-start gap-3 sm:gap-4"
                      >
                        <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl bg-muted/60 overflow-hidden flex items-center justify-center">
                          {item.imageUrl ? (
                              <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                              />
                          ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium break-words">
                            {item.productName}
                          </p>

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

                        <span className="font-semibold text-primary shrink-0 whitespace-nowrap">
                        {formatPrice(item.totalAmount)}
                      </span>
                      </div>
                  );
                })}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-base sm:text-lg">
                <span>Total</span>

                <span className="text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Card>
          </div>

          <Card className="p-4 sm:p-5 h-fit space-y-4">
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
                    <MessageSquare className="h-4 w-4 text-primary shrink-0" />

                    <span className="font-medium text-sm">Votre message</span>
                  </div>

                  <p className="text-sm text-muted-foreground break-words">
                    {order.message}
                  </p>
                </div>
            )}
          </Card>
        </div>
      </PageShell>
  );
};

export default OrderDetail;