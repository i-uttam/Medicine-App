import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { medicinesTable } from "@workspace/db/schema";
import { eq, ilike, or, and, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/medicines
router.get("/medicines", async (req, res) => {
  const { search, categoryId, prescriptionRequired, limit = "50", offset = "0" } =
    req.query as Record<string, string>;

  const limitNum = Math.max(1, Math.min(parseInt(limit, 10) || 50, 200));
  const offsetNum = Math.max(0, parseInt(offset, 10) || 0);

  const conditions = [];

  if (search && search.trim()) {
    const term = search.trim();
    conditions.push(
      or(
        ilike(medicinesTable.name, `%${term}%`),
        ilike(medicinesTable.brand, `%${term}%`),
        ilike(medicinesTable.genericName, `%${term}%`),
      ),
    );
  }

  if (categoryId) {
    const catId = parseInt(categoryId, 10);
    if (!isNaN(catId) && catId > 0) {
      conditions.push(eq(medicinesTable.categoryId, catId));
    }
  }

  if (prescriptionRequired !== undefined) {
    conditions.push(
      eq(medicinesTable.prescriptionRequired, prescriptionRequired === "true"),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(medicinesTable)
      .where(where)
      .limit(limitNum)
      .offset(offsetNum)
      .orderBy(medicinesTable.name),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(medicinesTable)
      .where(where),
  ]);

  res.json({
    data,
    total: countResult[0]?.count ?? 0,
    limit: limitNum,
    offset: offsetNum,
  });
});

// GET /api/medicines/:id
router.get("/medicines/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid medicine ID" });
    return;
  }

  const rows = await db
    .select()
    .from(medicinesTable)
    .where(eq(medicinesTable.id, id))
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }

  res.json(rows[0]);
});

export default router;
