import express from "express";
import {
  createTransaction,
  getUserTransactions,
  getTransactionById,
} from "../controllers/transaction.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.post("/", createTransaction);
router.get("/", getUserTransactions);
router.get("/:id", getTransactionById);

export default router;
