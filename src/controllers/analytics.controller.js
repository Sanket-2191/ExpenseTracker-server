import { Budget } from "../models/budget.model.js";
import { Transaction } from "../models/transaction.model.js";
import { sendAPIResp } from "../utils/sendApiResp.js";
import { sendError } from "../utils/sendErrorResp.js";



export const getBudgetOverview = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { month, year } = req.query;

    if (!month || !year) return sendError(res, 400, "Month and year required");

    const [totals] = await Transaction.aggregate([
        {
            $match: {
                userId,
                $expr: {
                    $and: [
                        { $eq: [{ $month: "$date" }, parseInt(month)] },
                        { $eq: [{ $year: "$date" }, parseInt(year)] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);

    const budgets = await Budget.aggregate([
        {
            $match: {
                userId,
                month: parseInt(month),
                year: parseInt(year)
            }
        },
        {
            $group: {
                _id: null,
                totalBudget: { $sum: "$limit" }
            }
        }
    ]);

    const income = totals?.find(t => t._id === "income")?.total || 0;
    const expense = totals?.find(t => t._id === "expense")?.total || 0;
    const totalBudget = budgets[0]?.totalBudget || 0;
    const balance = income - expense;

    return sendAPIResp(res, 200, "Budget overview", {
        income,
        expense,
        balance,
        totalBudget
    });
});


export const getOverspentCategories = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { month, year } = req.query;

    if (!month || !year) return sendError(res, 400, "Month and year required");

    const expenses = await Transaction.aggregate([
        {
            $match: {
                userId,
                type: "expense",
                $expr: {
                    $and: [
                        { $eq: [{ $month: "$date" }, parseInt(month)] },
                        { $eq: [{ $year: "$date" }, parseInt(year)] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$category",
                totalSpent: { $sum: "$amount" }
            }
        }
    ]);

    const budgets = await Budget.find({
        userId,
        month: parseInt(month),
        year: parseInt(year)
    });

    const overspent = [];

    for (let expense of expenses) {
        const budget = budgets.find(b => b.category === expense._id);
        if (budget && expense.totalSpent > budget.limit) {
            overspent.push({
                category: expense._id,
                spent: expense.totalSpent,
                limit: budget.limit,
                status: "overspent"
            });
        }
    }

    return sendAPIResp(res, 200, "Overspent categories", overspent);
});
