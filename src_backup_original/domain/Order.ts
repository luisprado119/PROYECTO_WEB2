import { OrderDetailLine } from "./OrderDetailLine";

export class Order {
  constructor(
    public readonly id: number,
    public readonly customerId: string,
    public readonly orderDate: Date,
    public readonly shippedDate: Date | null,
    public readonly details: OrderDetailLine[]
  ) {}

  getTotal(): number {
    return this.details.reduce((s, d) => s + d.subtotal, 0);
  }

  isShipped(): boolean {
    return this.shippedDate != null;
  }
}
