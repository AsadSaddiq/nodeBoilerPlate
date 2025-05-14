import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 2022,
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/poker",
  jwtSecret: process.env.JWT_SECRET || "my secrete token",
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
};
