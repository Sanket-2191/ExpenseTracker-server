import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            default: "other",
            enum: [
                "food",
                "transport",
                "shopping",
                "utilities",
                "entertainment",
                "salary",
                "investment",
                "other",
            ],
        },
        amount: {
            type: Number,
            required: true,
        },
        month: {
            type: Number, // 0 = Jan, 11 = Dec
            required: true,
            min: 0,
            max: 11
        },
        year: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Budget = mongoose.model("Budget", budgetSchema);
