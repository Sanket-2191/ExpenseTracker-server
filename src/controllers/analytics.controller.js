import { Budget } from "../models/budget.model.js";
import { Transaction } from "../models/transaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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


export const getBudgetVsTransactionByMonthYearCategory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { month, year } = req.query;

    if (!month || !year) return sendError(res, 400, "Month and year required");

    // Group total expense by category
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

    // Get budgeted categories for this month
    const budgets = await Budget.find({
        userId,
        month: parseInt(month),
        year: parseInt(year)
    });

    const data = [];

    for (let budget of budgets) {
        const expense = expenses.find(e => e._id === budget.category);
        data.push({
            category: budget.category,
            spent: expense?.totalSpent || 0,
            limit: budget.limit,
            status: (expense?.totalSpent || 0) > budget.limit ? "overspent" : "within budget"
        });
    }

    return sendAPIResp(res, 200, "Budget vs Transactions", data);
});


export const getMonthlyTrends = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { year } = req.query;

    if (!year) return sendError(res, 400, "Year is required");

    const trends = await Transaction.aggregate([
        {
            $match: {
                userId,
                $expr: {
                    $eq: [{ $year: "$date" }, parseInt(year)]
                }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$date" },
                    type: "$type"
                },
                total: { $sum: "$amount" }
            }
        }
    ]);

    // Initialize monthly array (1–12)
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: 0,
        expense: 0
    }));

    for (let entry of trends) {
        const monthIndex = entry._id.month - 1;
        if (entry._id.type === "income") {
            monthlyData[monthIndex].income = entry.total;
        } else if (entry._id.type === "expense") {
            monthlyData[monthIndex].expense = entry.total;
        }
    }

    return sendAPIResp(res, 200, "Monthly trends for income and expenses", monthlyData);
});
