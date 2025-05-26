import { Budget } from "../models/budget.model.js";
import { sendAPIResp } from "../utils/sendApiResp.js";
import { sendError } from "../utils/sendErrorResp.js";

// Create a new budget
export const createBudget = async (req, res) => {
    try {
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
    } catch (error) {
        return sendError(res, 500, 'Something went wrong while creating the budget');
    }
};

// Get all budgets for the logged-in user
export const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id }).sort({ year: -1, month: -1 });

        return sendAPIResp(res, 200, 'Budgets fetched successfully ✅✅', budgets);
    } catch (error) {
        return sendError(res, 500, 'Something went wrong while fetching budgets');
    }
};

// Update a budget
export const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const budget = await Budget.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!budget) {
            return sendError(res, 404, 'Budget not found or unauthorized');
        }

        return sendAPIResp(res, 200, 'Budget updated successfully ✅', budget);
    } catch (error) {
        return sendError(res, 500, 'Something went wrong while updating the budget');
    }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const budget = await Budget.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!budget) {
            return sendError(res, 404, 'Budget not found or unauthorized');
        }

        return sendAPIResp(res, 200, 'Budget deleted successfully ✅');
    } catch (error) {
        return sendError(res, 500, 'Something went wrong while deleting the budget');
    }
};
