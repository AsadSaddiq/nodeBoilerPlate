import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { unProtectedRouter, protectedRouter } from "../routes/index.js";
import { authenticate } from "../middleware/auth.middleware.js";

async function expressLoader(app) {
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // Routes
  app.use("/api", unProtectedRouter);
  app.use("/api", authenticate, protectedRouter);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
  });

  // Handle 404
  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      response: "Not Found",
      message: "The requested resource was not found",
      data: {},
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: 500,
      response: "Internal Server Error",
      message: err.message || "Something went wrong",
      data: {},
    });
  });
}

export default expressLoader;
