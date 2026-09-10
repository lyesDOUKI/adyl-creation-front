import type { OrderStatus } from './OrderStatus';
import type { OrderStep } from './OrderStep';

const FLOW: Array<{ status: OrderStatus; label: string }> = [
    { status: 'PENDING', label: 'Commande reçue' },
    { status: 'ACCEPTED', label: 'Acceptée' },
    { status: 'DELIVERED', label: 'Livrée' },
];

export const buildOrderSteps = (
    status: OrderStatus,
    createdAt: Date,
    updatedAt: Date,
): OrderStep[] => {
    if (status === 'REJECTED') {
        return [
            {
                status: 'PENDING',
                label: 'Commande reçue',
                date: createdAt,
                completed: true,
            },
            {
                status: 'REJECTED',
                label: 'Refusée',
                date: updatedAt,
                completed: true,
            },
        ];
    }

    const currentIndex = FLOW.findIndex((step) => step.status === status);

    return FLOW.map((step, index) => ({
        status: step.status,
        label: step.label,
        date:
            index === 0
                ? createdAt
                : index === currentIndex
                    ? updatedAt
                    : undefined,
        completed: currentIndex >= 0 && index <= currentIndex,
    }));
};