import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  ordersTable,
  orderItemsTable,
  medicinesTable,
  cartItemsTable,
} from "@workspace/db/schema";
import { eq, sql, inArray } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/orders/user/:userId  — must be before /orders/:id to avoid conflict
router.get("/orders/user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId <= 0) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(sql`${ordersTable.createdAt} desc`);

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db
        .select({
          id: orderItemsTable.id,
          medicineId: orderItemsTable.medicineId,
          qty: orderItemsTable.qty,
          price: orderItemsTable.price,
          medicine: medicinesTable,
        })
        .from(orderItemsTable)
        .leftJoin(medicinesTable, eq(orderItemsTable.medicineId, medicinesTable.id))
        .where(eq(orderItemsTable.orderId, order.id));

      return { ...order, items };
    }),
  );

  res.json(ordersWithItems);
});

// GET /api/orders/:id
router.get("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const orderRows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id))
    .limit(1);

  if (orderRows.length === 0) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const items = await db
    .select({
      id: orderItemsTable.id,
      medicineId: orderItemsTable.medicineId,
      qty: orderItemsTable.qty,
      price: orderItemsTable.price,
      medicine: medicinesTable,
    })
    .from(orderItemsTable)
    .leftJoin(medicinesTable, eq(orderItemsTable.medicineId, medicinesTable.id))
    .where(eq(orderItemsTable.orderId, id));

  res.json({ ...orderRows[0], items });
});

// PATCH /api/orders/:id  — update order status (e.g. cancel)
router.patch("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const { status, userId } = req.body as { status?: string; userId?: number };

  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  const validStatuses = ["Pending", "Accepted", "Packed", "Dispatched", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
    return;
  }

  const orderRows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id))
    .limit(1);

  if (orderRows.length === 0) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (userId !== undefined && orderRows[0].userId !== userId) {
    res.status(403).json({ error: "Not authorized to modify this order" });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(ordersTable.id, id))
    .returning();

  const items = await db
    .select({
      id: orderItemsTable.id,
      medicineId: orderItemsTable.medicineId,
      qty: orderItemsTable.qty,
      price: orderItemsTable.price,
      medicine: medicinesTable,
    })
    .from(orderItemsTable)
    .leftJoin(medicinesTable, eq(orderItemsTable.medicineId, medicinesTable.id))
    .where(eq(orderItemsTable.orderId, id));

  res.json({ ...updated, items });
});

// POST /api/orders
router.post("/orders", async (req, res) => {
  const { userId, items, deliveryAddress, notes } = req.body as {
    userId?: unknown;
    items?: unknown;
    deliveryAddress?: unknown;
    notes?: unknown;
  };

  if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({ error: "userId must be a positive integer" });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "items must be a non-empty array" });
    return;
  }

  for (const item of items) {
    if (
      typeof item !== "object" ||
      !Number.isInteger(item.medicineId) ||
      item.medicineId <= 0 ||
      !Number.isInteger(item.qty) ||
      item.qty <= 0
    ) {
      res.status(400).json({
        error: "Each item must have medicineId (positive int) and qty (positive int)",
      });
      return;
    }
  }

  if (
    deliveryAddress !== undefined &&
    typeof deliveryAddress !== "string"
  ) {
    res.status(400).json({ error: "deliveryAddress must be a string" });
    return;
  }

  const typedItems = items as Array<{ medicineId: number; qty: number }>;

  const medicineIds = typedItems.map((i) => i.medicineId);
  const medicines = await db
    .select({ id: medicinesTable.id, wholesalePrice: medicinesTable.wholesalePrice })
    .from(medicinesTable)
    .where(inArray(medicinesTable.id, medicineIds));

  if (medicines.length !== medicineIds.length) {
    const foundIds = new Set(medicines.map((m) => m.id));
    const missing = medicineIds.filter((id) => !foundIds.has(id));
    res.status(400).json({ error: `Medicine IDs not found: ${missing.join(", ")}` });
    return;
  }

  const priceMap = new Map(medicines.map((m) => [m.id, parseFloat(m.wholesalePrice)]));

  let subtotal = 0;
  for (const item of typedItems) {
    subtotal += (priceMap.get(item.medicineId) ?? 0) * item.qty;
  }

  const gstAmount = subtotal * 0.12;
  const deliveryCharge = subtotal > 2000 ? 0 : 49;
  const total = subtotal + gstAmount + deliveryCharge;

  const result = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(ordersTable)
      .values({
        userId,
        subtotal: subtotal.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        deliveryAddress: typeof deliveryAddress === "string" ? deliveryAddress : null,
        notes: typeof notes === "string" ? notes : null,
      })
      .returning();

    await tx.insert(orderItemsTable).values(
      typedItems.map((item) => ({
        orderId: order.id,
        medicineId: item.medicineId,
        qty: item.qty,
        price: (priceMap.get(item.medicineId) ?? 0).toFixed(2),
      })),
    );

    await tx.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

    return order;
  });

  const fullItems = await db
    .select({
      id: orderItemsTable.id,
      medicineId: orderItemsTable.medicineId,
      qty: orderItemsTable.qty,
      price: orderItemsTable.price,
      medicine: medicinesTable,
    })
    .from(orderItemsTable)
    .leftJoin(medicinesTable, eq(orderItemsTable.medicineId, medicinesTable.id))
    .where(eq(orderItemsTable.orderId, result.id));

  res.status(201).json({ ...result, items: fullItems });
});

export default router;
