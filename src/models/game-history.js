import { DataTypes } from "sequelize";
import sequelize from "../loader/postgress.js";

const GameHistory = sequelize.define(
  "GameHistory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    handNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    potSize: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    winners: {
      type: DataTypes.JSONB, // Array of winner objects with userId and amount
      allowNull: false,
    },
    communityCards: {
      type: DataTypes.JSONB, // Array of card objects
      allowNull: true,
    },
    actions: {
      type: DataTypes.JSONB, // Array of player actions during the hand
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "game_histories",
  }
);

export default GameHistory;
