import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { medicinesTable } from "./medicines";

export const wishlistTable = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  medicineId: integer("medicine_id")
    .notNull()
    .references(() => medicinesTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWishlistSchema = createInsertSchema(wishlistTable).omit({
  id: true,
  createdAt: true,
});

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type WishlistItem = typeof wishlistTable.$inferSelect;
