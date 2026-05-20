"use server";

import { getDb } from "../connection";
import { ActivityLogRepository } from "../repositories/ActivityLogRepository";
import type { ActivityLogFilters } from "../db-types";
import { requireAdmin } from "@/lib/serverUtils";

export async function logActivity(
  username: string,
  action: string,
  target: string | null = null
): Promise<void> {
  await new ActivityLogRepository(await getDb()).insert(username, action, target);
}

export async function getActivityLog(token: string, filters: ActivityLogFilters = {}) {
  await requireAdmin(token);
  return new ActivityLogRepository(await getDb()).findFiltered(filters);
}
