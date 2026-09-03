export const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
};