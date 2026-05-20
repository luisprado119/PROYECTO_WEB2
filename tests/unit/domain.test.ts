import { describe, it, expect } from "vitest";
import { OrderDetailLine } from "@/domain/OrderDetailLine";
import { Order } from "@/domain/Order";
import { Product } from "@/domain/Product";

describe("OrderDetailLine", () => {
  it("subtotal = precio × cantidad × (1 − descuento)", () => {
    const line = new OrderDetailLine(10, 3, 0.1);
    expect(line.subtotal).toBeCloseTo(27, 10);
  });

  it("descuento 0 no altera el producto bruto", () => {
    const line = new OrderDetailLine(5, 4, 0);
    expect(line.subtotal).toBe(20);
  });
});

describe("Order (dominio)", () => {
  it("getTotal suma los subtotales de las líneas", () => {
    const details = [
      new OrderDetailLine(100, 1, 0),
      new OrderDetailLine(50, 2, 0),
      new OrderDetailLine(10, 10, 0.2),
    ];
    const order = new Order(1, "WHITC", new Date("2025-01-01"), null, details);
    expect(order.getTotal()).toBeCloseTo(100 + 100 + 80, 10);
  });

  it("isShipped es false sin fecha de envío", () => {
    const order = new Order(2, "EASTC", new Date(), null, []);
    expect(order.isShipped()).toBe(false);
  });

  it("isShipped es true con fecha de envío", () => {
    const order = new Order(3, "EASTC", new Date(), new Date("2025-02-01"), []);
    expect(order.isShipped()).toBe(true);
  });
});

describe("Product (stock)", () => {
  it("isInStock es true si hay unidades suficientes", () => {
    expect(new Product(1, 5).isInStock(5)).toBe(true);
    expect(new Product(2, 10).isInStock(1)).toBe(true);
  });

  it("isInStock es false por debajo del mínimo pedido", () => {
    expect(new Product(3, 0).isInStock(1)).toBe(false);
    expect(new Product(4, 3).isInStock(4)).toBe(false);
  });
});
