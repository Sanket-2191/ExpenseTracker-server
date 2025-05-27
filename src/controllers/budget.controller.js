import { Budget } from "../models/budget.model.js";
import { sendAPIResp } from "../utils/sendApiResp.js";
import { sendError } from "../utils/sendErrorResp.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new budget
export const createBudget = asyncHandler(async (req, res) => {
    const { category, limit, month, year } = req.body;

    if (!category || !limit || !month || !year) {
        return sendError(res, 400, 'All required fields must be provided');
    }

    const budget = await Budget.create({
        category,
        limit,
        month,
        year,
        userId: req.user._id,
    });

    return sendAPIResp(res, 201, 'Budget created successfully ✅✅', budget);
});

// Get all budgets for the logged-in user
export const getAllBudgets = asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ year: -1, month: -1 });
    return sendAPIResp(res, 200, 'Budgets fetched successfully ✅✅', budgets);
});

//  Get budget by category + month + year 
export const getBudgetByCategoryAndDate = asyncHandler(async (req, res) => {
    const { category, month, year } = req.query;

    if (!category || !month || !year) {
        return sendError(res, 400, 'category, month, and year are required');
    }

    const budget = await Budget.findOne({
        userId: req.user._id,
        category,
        month,
        year
    });

    if (!budget) {
        return sendError(res, 404, 'No matching budget found');
    }

    return sendAPIResp(res, 200, 'Budget fetched successfully ✅', budget);
});

//  Update budget by category + month + year 
export const updateBudget = asyncHandler(async (req, res) => {
    const { category, month, year } = req.body;

    if (!category || !month || !year) {
        return sendError(res, 400, 'category, month, and year are required to update a budget');
    }

    const budget = await Budget.findOneAndUpdate(
        {
            userId: req.user._id,
            category,
            month,
            year
        },
        req.body,
        { new: true, runValidators: true }
    );

    if (!budget) {
        return sendError(res, 404, 'Budget not found or unauthorized');
    }

    return sendAPIResp(res, 200, 'Budget updated successfully ✅', budget);
});

// Delete a budget by ID
export const deleteBudget = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
        _id: id,
        userId: req.user._id,
    });

    if (!budget) {
        return sendError(res, 404, 'Budget not found or unauthorized');
    }

    return sendAPIResp(res, 200, 'Budget deleted successfully ✅');
});
