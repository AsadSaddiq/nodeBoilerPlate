import { Transaction } from "../models/index.js";
import { httpResponse } from "../utils/index.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, gameId, description, referenceId } = req.body;
    const userId = req.user.id;

    const transaction = await Transaction.create({
      userId,
      gameId,
      type,
      amount,
      status: "pending",
      description,
      referenceId,
    });

    // In a real application, you would process the transaction here
    // For example, if it's a deposit, you would integrate with a payment gateway

    // For this example, we'll just mark it as completed
    transaction.status = "completed";
    await transaction.save();

    return httpResponse.CREATED(
      res,
      { transaction },
      "Transaction created successfully"
    );
  } catch (error) {
    console.error("Create transaction error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return httpResponse.SUCCESS(
      res,
      { transactions },
      "Transactions retrieved successfully"
    );
  } catch (error) {
    console.error("Get user transactions error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      return httpResponse.NOT_FOUND(res, {}, "Transaction not found");
    }

    return httpResponse.SUCCESS(
      res,
      { transaction },
      "Transaction retrieved successfully"
    );
  } catch (error) {
    console.error("Get transaction by id error:", error);
    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};
