/** Catálogo Northwind: stock comprobable en dominio. */
export class Product {
  constructor(
    public readonly productId: number,
    public readonly unitsInStock: number
  ) {}

  isInStock(minUnits = 1): boolean {
    return this.unitsInStock >= minUnits;
  }
}
