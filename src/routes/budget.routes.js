import { Router } from "express";

import { verifyJWT } from "../middelwares/auth.middleware.js";
import {
    createBudget, deleteBudget, getAllBudgets,
    getBudgetByCategoryAndDate, updateBudget
} from '../controllers/budget.controller.js'


export const budgetRouter = Router();

budgetRouter.use(verifyJWT);

// Create
budgetRouter.post("/", createBudget);

// Read all
budgetRouter.get("/", getAllBudgets);

// Filter by month, year, category
budgetRouter.get("/filter", getBudgetByCategoryAndDate);

// Update
budgetRouter.patch("/:id", updateBudget);

// Delete
budgetRouter.delete("/:id", deleteBudget);
