import { DataTypes } from "sequelize";
import sequelize from "../loader/postgress.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.UUID,
      allowNull: true, // Not all transactions are related to games
    },
    type: {
      type: DataTypes.ENUM(
        "deposit",
        "withdrawal",
        "buy_in",
        "cash_out",
        "transfer"
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "cancelled"),
      defaultValue: "pending",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referenceId: {
      type: DataTypes.STRING, // For external payment references
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "transactions",
  }
);

export default Transaction;
