import type { Order } from '@/domain/order/Order';
import { formatPrice } from '@/domain/shared/formatPrice';

export const renderInvoiceText = (order: Order): string => {
  const lines = order.items.map(
    i => `  - ${i.productName} x${i.quantity} .......... ${formatPrice(i.unitPrice * i.quantity)}`
  );

  return `
═══════════════════════════════════════
           FACTURE — Adyl création
═══════════════════════════════════════

N° Commande : ${order.id}
Date        : ${order.createdAt.toLocaleDateString('fr-FR')}

Client      : ${order.customerName}
Téléphone   : ${order.customerPhone}
Adresse     : ${order.customerAddress}
Wilaya      : ${order.customerCity}

───────────────────────────────────────
Articles :
${lines.join('\n')}

───────────────────────────────────────
TOTAL : ${formatPrice(order.total)}
═══════════════════════════════════════

Merci pour votre confiance !
Adyl création — Créations artisanales au crochet
  `.trim();
};
