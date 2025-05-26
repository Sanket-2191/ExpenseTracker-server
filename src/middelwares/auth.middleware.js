import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError } from "../utils/sendErrorResp.js";
import { User } from "../models/user.model.js";

/// IS used every where user needs to be loggedin to be able to access the api.
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    // req.header("Authorization") used for mobile apps as they cant use cookies well.
    console.log("Token undefined:", !token);

    if (!token) {
        console.log("No token found. Attempting to refresh...");
        return sendError(
            res,
            401,
            "No accessToken found! please try renewing accessToken or logging-in again."
        )

    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // @ts-ignore
    if (!decodedToken._id) return sendError(res, 401, "Invalid token!")
    // t
    // @ts-ignore
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) return sendError(res, 404, "User not found!");

    req.user = user; // Attaching user to request
    next(); // Proceeding to next middleware

},
    { statusCode: 401, message: "Invalid or expired token! verifyJWT" }
)