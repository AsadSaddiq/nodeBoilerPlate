import express from "express";
import dotenv from "dotenv";
import loader from "./loader/index.js";
import config from "./config/index.js";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();

  try {
    // Initialize loaders
    await loader(app);

    // Start server
    const server = app.listen(config.env.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.env.port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception! Shutting down...", err);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection! Shutting down...", err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
