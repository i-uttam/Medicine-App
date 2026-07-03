import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, medicinesTable, cartItemsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/orders/user/:userId
router.get("/orders/user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(sql`${ordersTable.createdAt} desc`);

  res.json(orders);
});

// GET /api/orders/:id
router.get("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
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

// POST /api/orders
router.post("/orders", async (req, res) => {
  const { userId, items, deliveryAddress, notes } = req.body as {
    userId?: number;
    items?: Array<{ medicineId: number; qty: number }>;
    deliveryAddress?: string;
    notes?: string;
  };

  if (!userId || !items || items.length === 0) {
    res.status(400).json({ error: "userId and items are required" });
    return;
  }

  // Fetch medicine prices
  const medicineIds = items.map((i) => i.medicineId);
  const medicines = await db
    .select()
    .from(medicinesTable)
    .where(sql`${medicinesTable.id} = ANY(${medicineIds})`);

  const priceMap = new Map(medicines.map((m) => [m.id, parseFloat(m.wholesalePrice)]));

  let subtotal = 0;
  for (const item of items) {
    const price = priceMap.get(item.medicineId) ?? 0;
    subtotal += price * item.qty;
  }

  const gstAmount = subtotal * 0.12;
  const deliveryCharge = subtotal > 2000 ? 0 : 49;
  const total = subtotal + gstAmount + deliveryCharge;

  // Create order in transaction
  const [order] = await db
    .insert(ordersTable)
    .values({
      userId,
      subtotal: subtotal.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      total: total.toFixed(2),
      deliveryAddress: deliveryAddress ?? null,
      notes: notes ?? null,
    })
    .returning();

  const orderItems = await db
    .insert(orderItemsTable)
    .values(
      items.map((item) => ({
        orderId: order.id,
        medicineId: item.medicineId,
        qty: item.qty,
        price: (priceMap.get(item.medicineId) ?? 0).toFixed(2),
      })),
    )
    .returning();

  // Clear cart for user
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

  // Return full order detail
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
    .where(eq(orderItemsTable.orderId, order.id));

  res.status(201).json({ ...order, items: fullItems });
});

export default router;
