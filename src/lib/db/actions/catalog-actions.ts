"use server";

import { getDb } from "../connection";
import { CatalogRepository } from "../repositories/CatalogRepository";

export async function getAllProducts() {
  return new CatalogRepository(await getDb()).getAllProducts();
}

export async function getCategories() {
  return new CatalogRepository(await getDb()).getCategories();
}

export async function getProductsPaginated(
  categoryId: number | null,
  page: number,
  pageSize: number
) {
  return new CatalogRepository(await getDb()).getProductsPaginated(categoryId, page, pageSize);
}

export async function getFeaturedProducts(limit = 4) {
  return new CatalogRepository(await getDb()).getFeaturedProducts(limit);
}

export async function getProduct(productId: string) {
  return new CatalogRepository(await getDb()).getProductById(productId);
}
