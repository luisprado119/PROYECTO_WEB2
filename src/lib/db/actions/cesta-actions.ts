"use server";

import { getDb } from "../connection";
import { CestaRepository } from "../repositories/CestaRepository";

export async function associateCestaIdWithUsername(cestaId: string, username: string) {
  await new CestaRepository(await getDb()).associateCestaIdWithUsername(cestaId, username);
}

export async function cestaIncrement(productId: string, cestaId: string, username: string, delta: number) {
  await new CestaRepository(await getDb()).incrementLine(productId, cestaId, username, delta);
}

export async function removeFromCesta(productId: string, cestaId: string) {
  await new CestaRepository(await getDb()).deleteLine(productId, cestaId);
}

export async function cesta(productId: string, cestaId: string, username: string, cantidad: number) {
  await new CestaRepository(await getDb()).upsertLine(productId, cestaId, username, cantidad);
}

export async function getCesta(idCesta: string) {
  return new CestaRepository(await getDb()).getLines(idCesta);
}

export async function getCestaItemCount(cestaId: string) {
  return new CestaRepository(await getDb()).sumQuantities(cestaId);
}

export async function deleteCestaByCestaId(cestaId: string) {
  await new CestaRepository(await getDb()).deleteByCestaId(cestaId);
}
