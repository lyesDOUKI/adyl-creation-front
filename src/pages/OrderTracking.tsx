import {useNavigate} from 'react-router-dom';
import {useOrders} from '@/ui/hooks/useOrders';
import {formatPrice} from '@/domain/shared/formatPrice';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {CheckCircle2, ChevronRight, Clock, Package, Truck, XCircle,} from 'lucide-react';
import {ErrorMessage} from '@/components/ui/error-message';
import type {OrderStatus} from '@/domain/order/OrderStatus';

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

// Couleur + icône par statut : un badge "outline" ne suffisait pas à
// distinguer "En attente" de "Refusée" au premier coup d'œil.
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
 * PAGE SHELL — garde le Header/Footer visibles pendant le
 * chargement et en cas d'erreur, au lieu d'un spinner isolé.
 * ============================================================ */

const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1 container px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 max-w-2xl animate-fade-in">
        {children}
      </main>

      <Footer />
    </div>
);

/* ============================================================
 * ORDER ROW
 * ============================================================ */

const OrderRow = ({
                    order,
                  }: {
  order: {
    id: string;
    orderReference: string;
    status: OrderStatus;
    lineCount: number;
    createdAt: Date;
    total: number;
    items: { imageUrl?: string }[];
  };
}) => {
  const navigate = useNavigate();
  const firstItem = order.items[0];
  const StatusIcon = statusIcons[order.status];

  const goToOrder = () => navigate(`/suivi/${order.id}`);

  return (
      <Card
          role="button"
          tabIndex={0}
          onClick={goToOrder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goToOrder();
            }
          }}
          className="p-3.5 sm:p-4 cursor-pointer transition-all duration-150 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Image / placeholder — toujours affiché pour éviter un
              décalage de mise en page quand une commande n'a pas de
              visuel. */}
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl bg-muted/60 overflow-hidden flex items-center justify-center">
            {firstItem?.imageUrl ? (
                <img
                    src={firstItem.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                <Package className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="font-heading font-bold text-sm truncate">
                {order.orderReference}
              </span>

              <Badge
                  variant={statusVariants[order.status]}
                  className={`text-[10px] gap-1 shrink-0 ${statusColors[order.status]}`}
              >
                <StatusIcon className="h-2.5 w-2.5" />
                {statusLabels[order.status]}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground truncate">
              {order.lineCount} article
              {order.lineCount > 1 ? 's' : ''} ·{' '}
              {order.createdAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 pl-1">
            <span className="font-semibold text-primary text-sm whitespace-nowrap">
              {formatPrice(order.total)}
            </span>

            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </Card>
  );
};

/* ============================================================
 * PAGE
 * ============================================================ */

const OrderTracking = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
        <PageShell>
          <div className="h-8 w-48 rounded bg-muted animate-pulse mb-3" />
          <div className="h-4 w-72 max-w-full rounded bg-muted animate-pulse mb-8" />

          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-xl bg-muted animate-pulse" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-40 rounded bg-muted animate-pulse" />
                    </div>

                    <div className="h-4 w-14 rounded bg-muted animate-pulse" />
                  </div>
                </Card>
            ))}
          </div>
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

  return (
      <PageShell>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
          Mes commandes
        </h1>

        <p className="text-muted-foreground mb-6 sm:mb-8">
          Retrouvez l'ensemble de vos commandes et suivez leur avancement.
        </p>

        {orders.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>

              <p className="text-base sm:text-lg font-medium mb-1">
                Aucune commande pour le moment
              </p>

              <p className="text-sm text-muted-foreground mb-6">
                Vos commandes apparaîtront ici dès que vous en aurez passé
                une.
              </p>

              <Button onClick={() => navigate('/')}>
                Découvrir la boutique
              </Button>
            </Card>
        ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
              ))}
            </div>
        )}
      </PageShell>
  );
};

export default OrderTracking;