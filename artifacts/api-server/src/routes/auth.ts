import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// POST /api/auth/login — phone-based login/register
router.post("/auth/login", async (req, res) => {
  const { phone, name } = req.body as { phone?: string; name?: string };

  if (!phone) {
    res.status(400).json({ error: "phone is required" });
    return;
  }

  // Find or create user
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.phone, phone))
    .limit(1);

  if (existing.length > 0) {
    res.json(existing[0]);
    return;
  }

  const created = await db
    .insert(usersTable)
    .values({ phone, name: name ?? null })
    .returning();

  res.json(created[0]);
});

export default router;
