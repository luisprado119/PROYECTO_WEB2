/** Línea de pedido Northwind para cálculos de dominio (subtotal). */
export class OrderDetailLine {
  constructor(
    public readonly unitPrice: number,
    public readonly quantity: number,
    public readonly discount: number
  ) {}

  get subtotal(): number {
    return this.unitPrice * this.quantity * (1 - this.discount);
  }
}
