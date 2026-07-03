import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, medicinesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/categories
router.get("/categories", async (_req, res) => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(categories);
});

// GET /api/categories/:id/medicines
router.get("/categories/:id/medicines", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category ID" });
    return;
  }

  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .limit(1);

  if (category.length === 0) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  const medicines = await db
    .select()
    .from(medicinesTable)
    .where(eq(medicinesTable.categoryId, id))
    .orderBy(medicinesTable.name);

  res.json(medicines);
});

export default router;
