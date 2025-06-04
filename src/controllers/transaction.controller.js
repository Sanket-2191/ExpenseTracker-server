import { Transaction } from "../models/transaction.model.js";
import { sendAPIResp } from "../utils/sendApiResp.js";
import { sendError } from "../utils/sendErrorResp.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new transaction
export const createTransaction = asyncHandler(async (req, res) => {
    const { amount, type, category, note, date } = req.body;

    if (!amount || !type || !category || !note) {
        return sendError(res, 400, 'All required fields must be provided');
    }

    const transaction = await Transaction.create({
        amount,
        type,
        category,
        note,
        date: date || null,
        userId: req.user._id,
    });

    return sendAPIResp(res, 201, 'Transaction created successfully ✅✅', transaction);
});

// Get all transactions for the logged-in user
export const getAllTransactions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { startDate, endDate, category, type } = req.query;

    const filter = {
        userId
    };

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category) filter.category = category;
    if (type) filter.type = type; // 'income' or 'expense'

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    return sendAPIResp(res, 200, "Transactions fetched successfully ✅✅", transactions);
});

// Update a transaction
export const updateTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, note, date, userId } = req.body;
    console.log("Received transaction for update: ", { amount, type, category, note, date, userId });

    const transaction = await Transaction.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { amount, type, category, note, date },
        { new: true, runValidators: true }
    );

    if (!transaction) {
        return sendError(res, 404, 'Transaction not found or unauthorized');
    }

    return sendAPIResp(res, 200, 'Transaction updated successfully ✅', transaction);
});

// Delete a transaction
export const deleteTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
        _id: id,
        userId: req.user._id,
    });

    if (!transaction) {
        return sendError(res, 404, 'Transaction not found or unauthorized');
    }

    return sendAPIResp(res, 200, 'Transaction deleted successfully ✅');
});
