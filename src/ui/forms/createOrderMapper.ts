import type { CartItem } from '@/domain/cart/CartItem';
import type { CreateOrderData, CreateOrderItem } from '@/domain/order/OrderRepository';
import type { AddressSuggestion } from '@/ui/hooks/useAddressAutocomplete';

export interface OrderFormValues {
    address: string;
    city: string;
    message: string;
}

export interface CheckoutWizardFormValues {
    address: string;
    city: string;
    message: string;
    selectedAddress: AddressSuggestion | null;
}

export const toOrderFormValues = (
    wizardForm: CheckoutWizardFormValues
): OrderFormValues => ({
    address: wizardForm.selectedAddress
        ? wizardForm.selectedAddress.label
        : wizardForm.address,
    city: wizardForm.selectedAddress
        ? wizardForm.selectedAddress.city
        : wizardForm.city,
    message: wizardForm.message,
});

export const toCreateOrderItem = (cartItem: CartItem): CreateOrderItem => ({
    productId: cartItem.product.id,
    quantity: cartItem.quantity,
    chosenColor: cartItem.selectedColor,
});

export const toCreateOrderData = (
    form: OrderFormValues,
    items: CartItem[]
): CreateOrderData => ({
    customerAddress: form.address,
    customerCity: form.city,
    message: form.message || null,
    items: items.map(toCreateOrderItem),
});