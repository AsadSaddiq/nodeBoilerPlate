import express from "express";
import authRoutes from "./auth.routes.js";
import gameRoutes from "./game.routes.js";
import transactionRoutes from "./transaction.routes.js";

const unProtectedRouter = express.Router();
const protectedRouter = express.Router();

// Unprotected routes
unProtectedRouter.use("/auth", authRoutes);

// Protected routes
protectedRouter.use("/games", gameRoutes);
protectedRouter.use("/transactions", transactionRoutes);

export { unProtectedRouter, protectedRouter };
