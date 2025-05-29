import { Router } from "express";

import { verifyJWT } from "../middelwares/auth.middleware.js";
import {
    getBudgetOverview, getBudgetVsTransactionByMonthYearCategory,
    getMonthlyTrends, getOverspentCategories
} from "../controllers/analytics.controller.js";

export const dashboardRouter = Router();

dashboardRouter.use(verifyJWT);

// Compare actual vs budgeted
dashboardRouter.get("/compare", getBudgetVsTransactionByMonthYearCategory);

// Trend line for entire year
dashboardRouter.get("/monthly-trends", getMonthlyTrends);

// Total balance (income - expenses) and remaining budgets
dashboardRouter.get("/overview", getBudgetOverview);

// Categories where spending > budget
dashboardRouter.get("/overspent", getOverspentCategories);