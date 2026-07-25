import type { Order } from '@/domain/order/Order';
import { renderInvoiceText } from '@/domain/invoice/renderInvoiceText';

export const downloadOrderInvoice = (order: Order): void => {
  const content = renderInvoiceText(order);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `facture-${order.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
