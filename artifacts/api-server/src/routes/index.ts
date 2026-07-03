import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import medicinesRouter from "./medicines";
import authRouter from "./auth";
import usersRouter from "./users";
import cartRouter from "./cart";
import wishlistRouter from "./wishlist";
import ordersRouter from "./orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(medicinesRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(cartRouter);
router.use(wishlistRouter);
router.use(ordersRouter);

export default router;
