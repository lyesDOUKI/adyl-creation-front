export class InsufficientStockError extends Error {
    constructor(public readonly name: string) {
        super(`Stock insuffisant pour le produit ${name}.`);
        this.name = 'InsufficientStockError';
    }
}