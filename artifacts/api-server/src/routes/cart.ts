import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, medicinesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const cartWithMedicine = {
  id: cartItemsTable.id,
  userId: cartItemsTable.userId,
  medicineId: cartItemsTable.medicineId,
  qty: cartItemsTable.qty,
  createdAt: cartItemsTable.createdAt,
  medicine: medicinesTable,
};

// GET /api/cart/:userId
router.get("/cart/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId <= 0) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const items = await db
    .select(cartWithMedicine)
    .from(cartItemsTable)
    .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
    .where(eq(cartItemsTable.userId, userId));

  res.json(items);
});

// POST /api/cart
router.post("/cart", async (req, res) => {
  const { userId, medicineId, qty } = req.body as Record<string, unknown>;

  if (!Number.isInteger(userId) || (userId as number) <= 0) {
    res.status(400).json({ error: "userId must be a positive integer" });
    return;
  }
  if (!Number.isInteger(medicineId) || (medicineId as number) <= 0) {
    res.status(400).json({ error: "medicineId must be a positive integer" });
    return;
  }
  if (!Number.isInteger(qty) || (qty as number) <= 0) {
    res.status(400).json({ error: "qty must be a positive integer" });
    return;
  }

  const uid = userId as number;
  const mid = medicineId as number;
  const q = qty as number;

  // Upsert: if item already in cart, add qty
  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, uid), eq(cartItemsTable.medicineId, mid)))
    .limit(1);

  let itemId: number;

  if (existing.length > 0) {
    const [updated] = await db
      .update(cartItemsTable)
      .set({ qty: existing[0].qty + q })
      .where(eq(cartItemsTable.id, existing[0].id))
      .returning();
    itemId = updated.id;
  } else {
    const [created] = await db
      .insert(cartItemsTable)
      .values({ userId: uid, medicineId: mid, qty: q })
      .returning();
    itemId = created.id;
  }

  const [full] = await db
    .select(cartWithMedicine)
    .from(cartItemsTable)
    .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
    .where(eq(cartItemsTable.id, itemId));

  res.status(201).json(full);
});

// PATCH /api/cart/item/:id  — must be before DELETE /api/cart/:userId
router.patch("/cart/item/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid cart item ID" });
    return;
  }

  const { qty } = req.body as Record<string, unknown>;
  if (!Number.isInteger(qty) || (qty as number) <= 0) {
    res.status(400).json({ error: "qty must be a positive integer" });
    return;
  }

  const [updated] = await db
    .update(cartItemsTable)
    .set({ qty: qty as number })
    .where(eq(cartItemsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  const [full] = await db
    .select(cartWithMedicine)
    .from(cartItemsTable)
    .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
    .where(eq(cartItemsTable.id, updated.id));

  res.json(full);
});

// DELETE /api/cart/item/:id
router.delete("/cart/item/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid cart item ID" });
    return;
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
  res.json({ success: true });
});

// DELETE /api/cart/:userId — clear entire cart
router.delete("/cart/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId <= 0) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
  res.json({ success: true });
});

export default router;
