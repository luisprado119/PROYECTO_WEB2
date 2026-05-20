"use server";

import { getDb } from "../connection";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { requireCustomerSession } from "../guards";
import { requireAdmin } from "@/lib/serverUtils";
import type { CustomerSavePayload } from "../db-types";

export async function getCustomer(token: string, customerId: string) {
  await requireCustomerSession(token, customerId);
  return new CustomerRepository(await getDb()).findById(customerId);
}

export async function saveCustomer(token: string, customerId: string, values: CustomerSavePayload) {
  await requireCustomerSession(token, customerId);
  await new CustomerRepository(await getDb()).updateProfile(customerId, values);
}

export async function getAllCustomers(token: string) {
  await requireAdmin(token);
  return new CustomerRepository(await getDb()).listForAdmin();
}

export async function getCustomerAdmin(token: string, customerId: string) {
  await requireAdmin(token);
  return new CustomerRepository(await getDb()).findById(customerId);
}
