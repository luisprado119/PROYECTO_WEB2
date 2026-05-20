"use server";

import { getDb } from "../connection";
import { requireAdmin } from "@/lib/serverUtils";
import { SalesRepository } from "../repositories/SalesRepository";
import type { SalesGranularity } from "../db-types";

export async function getSalesByPeriod(token: string, granularity: SalesGranularity) {
  await requireAdmin(token);
  return new SalesRepository(await getDb()).salesByPeriod(granularity);
}

export async function getSalesByCategoryAndPeriod(token: string, granularity: SalesGranularity) {
  await requireAdmin(token);
  return new SalesRepository(await getDb()).salesByCategoryAndPeriod(granularity);
}
