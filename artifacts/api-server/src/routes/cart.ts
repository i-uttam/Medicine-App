import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, medicinesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/cart/:userId
router.get("/cart/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const items = await db
    .select({
      id: cartItemsTable.id,
      userId: cartItemsTable.userId,
      medicineId: cartItemsTable.medicineId,
      qty: cartItemsTable.qty,
      createdAt: cartItemsTable.createdAt,
      medicine: medicinesTable,
    })
    .from(cartItemsTable)
    .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
    .where(eq(cartItemsTable.userId, userId));

  res.json(items);
});

// POST /api/cart
router.post("/cart", async (req, res) => {
  const { userId, medicineId, qty } = req.body as {
    userId?: number;
    medicineId?: number;
    qty?: number;
  };

  if (!userId || !medicineId || !qty) {
    res.status(400).json({ error: "userId, medicineId, and qty are required" });
    return;
  }

  // Upsert: if item already in cart, update qty
  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.userId, userId),
        eq(cartItemsTable.medicineId, medicineId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    const updated = await db
      .update(cartItemsTable)
      .set({ qty: existing[0].qty + qty })
      .where(eq(cartItemsTable.id, existing[0].id))
      .returning();

    const [full] = await db
      .select({
        id: cartItemsTable.id,
        userId: cartItemsTable.userId,
        medicineId: cartItemsTable.medicineId,
        qty: cartItemsTable.qty,
        createdAt: cartItemsTable.createdAt,
        medicine: medicinesTable,
      })
      .from(cartItemsTable)
      .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
      .where(eq(cartItemsTable.id, updated[0].id));

    res.status(201).json(full);
    return;
  }

  const created = await db
    .insert(cartItemsTable)
    .values({ userId, medicineId, qty })
    .returning();

  const [full] = await db
    .select({
      id: cartItemsTable.id,
      userId: cartItemsTable.userId,
      medicineId: cartItemsTable.medicineId,
      qty: cartItemsTable.qty,
      createdAt: cartItemsTable.createdAt,
      medicine: medicinesTable,
    })
    .from(cartItemsTable)
    .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
    .where(eq(cartItemsTable.id, created[0].id));

  res.status(201).json(full);
});

// PATCH /api/cart/item/:id
router.patch("/cart/item/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid cart item ID" });
    return;
  }

  const { qty } = req.body as { qty?: number };
  if (!qty || qty < 1) {
    res.status(400).json({ error: "qty must be >= 1" });
    return;
  }

  const updated = await db
    .update(cartItemsTable)
    .set({ qty })
    .where(eq(cartItemsTable.id, id))
    .returning();

  if (updated.length === 0) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  const [full] = await db
    .select({
      id: cartItemsTable.id,
      userId: cartItemsTable.userId,
      medicineId: cartItemsTable.medicineId,
      qty: cartItemsTable.qty,
      createdAt: cartItemsTable.createdAt,
      medicine: medicinesTable,
    })
    .from(cartItemsTable)
    .leftJoin(medicinesTable, eq(cartItemsTable.medicineId, medicinesTable.id))
    .where(eq(cartItemsTable.id, updated[0].id));

  res.json(full);
});

// DELETE /api/cart/item/:id
router.delete("/cart/item/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid cart item ID" });
    return;
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
  res.json({ success: true });
});

// DELETE /api/cart/:userId — clear entire cart
router.delete("/cart/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
  res.json({ success: true });
});

export default router;
