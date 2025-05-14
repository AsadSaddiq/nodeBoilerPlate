import User from "./user.js";
import Game from "./game.js";
import Player from "./player.js";
import Transaction from "./transaction.js";
import GameHistory from "./game-history.js";

// Define model associations
User.hasMany(Game, { foreignKey: "createdBy", as: "createdGames" });
Game.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

User.hasMany(Player, { foreignKey: "userId", as: "players" });
Player.belongsTo(User, { foreignKey: "userId", as: "user" });

Game.hasMany(Player, { foreignKey: "gameId", as: "players" });
Player.belongsTo(Game, { foreignKey: "gameId", as: "game" });

User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

Game.hasMany(Transaction, { foreignKey: "gameId", as: "transactions" });
Transaction.belongsTo(Game, { foreignKey: "gameId", as: "game" });

Game.hasMany(GameHistory, { foreignKey: "gameId", as: "gameHistories" });
GameHistory.belongsTo(Game, { foreignKey: "gameId", as: "game" });

export { User, Game, Player, Transaction, GameHistory };
