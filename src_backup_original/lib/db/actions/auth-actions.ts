"use server";

import jwt from "jsonwebtoken";
import { getDb } from "../connection";
import { UserRepository } from "../repositories/UserRepository";
import { ActivityLogRepository } from "../repositories/ActivityLogRepository";
import { requireCustomerSession } from "../guards";

export async function insertUser(
  username: string,
  password: string,
  acceptPolicy: boolean,
  acceptMarketing: boolean
) {
  const db = await getDb();
  const id = await new UserRepository(db).insertWithCustomer(
    username,
    password,
    acceptPolicy,
    acceptMarketing
  );
  await new ActivityLogRepository(db).insert(username, "signup", username);
  return id;
}

export async function getUser(username: string, password: string) {
  const db = await getDb();
  const users = new UserRepository(db);
  const row = await users.findByCredentials(username, password);
  if (!row) throw new Error("Invalid username or password");
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");
  const token = jwt.sign({ id: row.id, username: row.username, role: row.role }, secret, {
    expiresIn: "1h",
  });
  await new ActivityLogRepository(db).insert(row.username, "login", null);
  return { ...row, token };
}

export async function setPassword(
  token: string,
  customerId: string,
  currentPassword: string,
  newPassword: string
) {
  await requireCustomerSession(token, customerId);
  const db = await getDb();
  const users = new UserRepository(db);
  if (!(await users.verifyPassword(customerId, currentPassword))) {
    throw new Error("Invalid username or password");
  }
  await users.updatePassword(customerId, newPassword);
  await new ActivityLogRepository(db).insert(customerId, "password_changed", null);
}
