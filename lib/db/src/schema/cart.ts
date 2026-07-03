import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { medicinesTable } from "./medicines";

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  medicineId: integer("medicine_id")
    .notNull()
    .references(() => medicinesTable.id),
  qty: integer("qty").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItemsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItemsTable.$inferSelect;
