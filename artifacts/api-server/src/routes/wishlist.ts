import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wishlistTable, medicinesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/wishlist/:userId
router.get("/wishlist/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const items = await db
    .select({
      id: wishlistTable.id,
      userId: wishlistTable.userId,
      medicineId: wishlistTable.medicineId,
      createdAt: wishlistTable.createdAt,
      medicine: medicinesTable,
    })
    .from(wishlistTable)
    .leftJoin(medicinesTable, eq(wishlistTable.medicineId, medicinesTable.id))
    .where(eq(wishlistTable.userId, userId));

  res.json(items);
});

// POST /api/wishlist
router.post("/wishlist", async (req, res) => {
  const { userId, medicineId } = req.body as {
    userId?: number;
    medicineId?: number;
  };

  if (!userId || !medicineId) {
    res.status(400).json({ error: "userId and medicineId are required" });
    return;
  }

  // Prevent duplicate
  const existing = await db
    .select()
    .from(wishlistTable)
    .where(
      and(eq(wishlistTable.userId, userId), eq(wishlistTable.medicineId, medicineId)),
    )
    .limit(1);

  if (existing.length > 0) {
    const [full] = await db
      .select({
        id: wishlistTable.id,
        userId: wishlistTable.userId,
        medicineId: wishlistTable.medicineId,
        createdAt: wishlistTable.createdAt,
        medicine: medicinesTable,
      })
      .from(wishlistTable)
      .leftJoin(medicinesTable, eq(wishlistTable.medicineId, medicinesTable.id))
      .where(eq(wishlistTable.id, existing[0].id));

    res.status(201).json(full);
    return;
  }

  const created = await db
    .insert(wishlistTable)
    .values({ userId, medicineId })
    .returning();

  const [full] = await db
    .select({
      id: wishlistTable.id,
      userId: wishlistTable.userId,
      medicineId: wishlistTable.medicineId,
      createdAt: wishlistTable.createdAt,
      medicine: medicinesTable,
    })
    .from(wishlistTable)
    .leftJoin(medicinesTable, eq(wishlistTable.medicineId, medicinesTable.id))
    .where(eq(wishlistTable.id, created[0].id));

  res.status(201).json(full);
});

// DELETE /api/wishlist/:id
router.delete("/wishlist/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid wishlist item ID" });
    return;
  }

  await db.delete(wishlistTable).where(eq(wishlistTable.id, id));
  res.json({ success: true });
});

export default router;
