import {
  pgTable,
  serial,
  integer,
  numeric,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { medicinesTable } from "./medicines";

export const orderStatusEnum = pgEnum("order_status", [
  "Pending",
  "Accepted",
  "Packed",
  "Dispatched",
  "Delivered",
  "Cancelled",
]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  status: orderStatusEnum("status").notNull().default("Pending"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  gstAmount: numeric("gst_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id),
  medicineId: integer("medicine_id")
    .notNull()
    .references(() => medicinesTable.id),
  qty: integer("qty").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
