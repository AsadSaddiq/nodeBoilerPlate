import { DataTypes } from "sequelize";
import sequelize from "../loader/postgress.js";

const Game = sequelize.define(
  "Game",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gameType: {
      type: DataTypes.ENUM("texas_holdem", "omaha", "seven_card_stud"),
      defaultValue: "texas_holdem",
    },
    blinds: {
      type: DataTypes.STRING, // Format: "small/big" e.g., "1/2"
      allowNull: false,
    },
    minBuyIn: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    maxBuyIn: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      defaultValue: 9,
    },
    status: {
      type: DataTypes.ENUM("waiting", "active", "completed", "cancelled"),
      defaultValue: "waiting",
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "games",
  }
);

export default Game;
