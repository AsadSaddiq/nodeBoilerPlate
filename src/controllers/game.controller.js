import { Game, Player, User } from "../models/index.js";
import { httpResponse } from "../utils/index.js";

export const createGame = async (req, res) => {
  try {
    const { name, gameType, blinds, minBuyIn, maxBuyIn, maxPlayers } = req.body;
    const userId = req.user.id;

    const game = await Game.create({
      name,
      gameType,
      blinds,
      minBuyIn,
      maxBuyIn,
      maxPlayers,
      status: "waiting",
      createdBy: userId,
    });

    return httpResponse.CREATED(res, { game }, "Game created successfully");
  } catch (error) {
    console.error("Create game error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email"],
        },
        {
          model: Player,
          as: "players",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });

    return httpResponse.SUCCESS(res, { games }, "Games retrieved successfully");
  } catch (error) {
    console.error("Get games error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email"],
        },
        {
          model: Player,
          as: "players",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });

    if (!game) {
      return httpResponse.NOT_FOUND(res, {}, "Game not found");
    }

    return httpResponse.SUCCESS(res, { game }, "Game retrieved successfully");
  } catch (error) {
    console.error("Get game by id error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const updateGameStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const game = await Game.findByPk(id);

    if (!game) {
      return httpResponse.NOT_FOUND(res, {}, "Game not found");
    }

    // Check if user is the creator of the game
    if (game.createdBy !== userId) {
      return httpResponse.FORBIDDEN(
        res,
        {},
        "Not authorized to update this game"
      );
    }

    game.status = status;
    await game.save();

    return httpResponse.SUCCESS(
      res,
      { game },
      "Game status updated successfully"
    );
  } catch (error) {
    console.error("Update game status error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const joinGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyIn, seatNumber } = req.body;
    const userId = req.user.id;

    const game = await Game.findByPk(id);

    if (!game) {
      return httpResponse.NOT_FOUND(res, {}, "Game not found");
    }

    if (game.status !== "waiting" && game.status !== "active") {
      return httpResponse.BAD_REQUEST(
        res,
        {},
        "Cannot join a completed or cancelled game"
      );
    }

    // Check if buy-in amount is valid
    if (buyIn < game.minBuyIn || buyIn > game.maxBuyIn) {
      return httpResponse.BAD_REQUEST(
        res,
        {},
        `Buy-in must be between ${game.minBuyIn} and ${game.maxBuyIn}`
      );
    }

    // Check if player is already in the game
    const existingPlayer = await Player.findOne({
      where: {
        userId,
        gameId: id,
        status: ["active", "sitting_out"],
      },
    });

    if (existingPlayer) {
      return httpResponse.CONFLICT(res, {}, "You are already in this game");
    }

    // Check if seat is available if seat number is provided
    if (seatNumber) {
      const seatTaken = await Player.findOne({
        where: {
          gameId: id,
          seatNumber,
          status: ["active", "sitting_out"],
        },
      });

      if (seatTaken) {
        return httpResponse.CONFLICT(res, {}, "This seat is already taken");
      }
    }

    // Check if game is full
    const playerCount = await Player.count({
      where: {
        gameId: id,
        status: ["active", "sitting_out"],
      },
    });

    if (playerCount >= game.maxPlayers) {
      return httpResponse.BAD_REQUEST(res, {}, "Game is full");
    }

    // Create player
    const player = await Player.create({
      userId,
      gameId: id,
      seatNumber,
      stackAmount: buyIn,
      status: "active",
    });

    return httpResponse.CREATED(res, { player }, "Joined game successfully");
  } catch (error) {
    console.error("Join game error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const leaveGame = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const player = await Player.findOne({
      where: {
        userId,
        gameId: id,
        status: ["active", "sitting_out"],
      },
    });

    if (!player) {
      return httpResponse.NOT_FOUND(res, {}, "You are not in this game");
    }

    player.status = "left";
    await player.save();

    return httpResponse.SUCCESS(res, { player }, "Left game successfully");
  } catch (error) {
    console.error("Leave game error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};
