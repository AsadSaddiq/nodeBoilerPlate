import { DataTypes } from "sequelize";
import sequelize from "../loader/postgress.js";

const Player = sequelize.define(
  "Player",
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
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stackAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM("active", "folded", "all_in", "sitting_out", "left"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "players",
  }
);

export default Player;
