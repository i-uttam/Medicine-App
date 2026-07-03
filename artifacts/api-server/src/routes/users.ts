import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/users/:id
router.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(rows[0]);
});

// PATCH /api/users/:id
router.patch("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { name, email, address } = req.body as {
    name?: string;
    email?: string;
    address?: string;
  };

  const updated = await db
    .update(usersTable)
    .set({ name, email, address })
    .where(eq(usersTable.id, id))
    .returning();

  if (updated.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(updated[0]);
});

export default router;
