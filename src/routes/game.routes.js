import express from "express";
import {
  createGame,
  getGames,
  getGameById,
  updateGameStatus,
  joinGame,
  leaveGame,
} from "../controllers/game.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.post("/", createGame);
router.get("/", getGames);
router.get("/:id", getGameById);
router.patch("/:id/status", updateGameStatus);
router.post("/:id/join", joinGame);
router.post("/:id/leave", leaveGame);

export default router;
