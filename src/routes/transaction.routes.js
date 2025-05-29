import { Router } from "express";

import { verifyJWT } from "../middelwares/auth.middleware.js";
import {
    createTransaction, deleteTransaction,
    getAllTransactions, updateTransaction
} from "../controllers/transaction.controller.js";

export const transactionRouter = Router();

transactionRouter.use(verifyJWT);

// Create
transactionRouter.post("/", createTransaction);

// Read
transactionRouter.get("/", getAllTransactions);

// Update
transactionRouter.patch("/:id", updateTransaction);

// Delete
transactionRouter.delete("/:id", deleteTransaction);
