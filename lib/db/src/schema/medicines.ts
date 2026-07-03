import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const medicinesTable = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  brand: text("brand").notNull(),
  strength: text("strength"),
  packSize: text("pack_size"),
  manufacturer: text("manufacturer"),
  description: text("description"),
  composition: text("composition"),
  uses: text("uses"), // JSON array stored as text
  dosage: text("dosage"),
  sideEffects: text("side_effects"), // JSON array stored as text
  storage: text("storage"),
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: numeric("wholesale_price", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).default("12"),
  stock: integer("stock").notNull().default(0),
  minOrderQty: integer("min_order_qty").notNull().default(1),
  prescriptionRequired: boolean("prescription_required").notNull().default(false),
  categoryId: integer("category_id").references(() => categoriesTable.id),
  iconName: text("icon_name"),
  iconColor: text("icon_color"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMedicineSchema = createInsertSchema(medicinesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicinesTable.$inferSelect;
