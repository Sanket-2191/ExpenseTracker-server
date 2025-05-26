import { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import getRandomColor from "../utils/randomColors.util";
import { sendError } from "../utils/sendErrorResp";


const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
            index: true, // to optimize searching based on username.
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        verified: {
            type: Boolean,
            default: false,
            trim: true
        },
        avatar: {
            type: String,
            default: getRandomColor(),
            trim: true
        },
        totalIncome: {
            type: Number,
            default: 0
        },
        totalExpense: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {

    /*
        so that bcrypt dont run every time when document is 
        modified and only run when "password" is modified
    */
    if (!this.isModified('password')) return next();
    try {
        // console.log('saving password...');

        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        throw new Error(error.message);
    }
})

// for login when user enters password...

userSchema.methods.isPasswordCorrect = async function (res, password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return sendError(
            res,
            500,
            error.message
        )
    }
}

userSchema.methods.generateAccessToken = function () {
    // @ts-ignore
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullname: this.fullname,
            email: this.email

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    // @ts-ignore
    return jwt.sign(
        {
            _id: this._id

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);