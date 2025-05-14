import { Sequelize } from "sequelize";
import config from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

// Get the current environment
const env = process.env.NODE_ENV || "development";
const { url, ...dbConfig } = config[env];

const sequelize = new Sequelize(url, {
  ...dbConfig,
  logging: env === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection has been established successfully!");

    // Comment out the sync in production environments
    // Only use migrations to manage your schema
    // if (env === "development") {
    //   await sequelize.sync({ alter: true })
    //   console.log("✅ All models were synchronized successfully!")
    // }

    return sequelize;
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;
