import { Router } from "express";

import { upload } from "../middelwares/multer.middleware.js";
import {
    changeUserPassword, getCurrentUser, getUserChannelProfile,
    loginUser, logoutUser, refreshAccessToken, registerUser,
    updateCurrentUserDetail, updateUserAvatar
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";



export const userRouter = Router();

// Public routes
userRouter.route('/signup').post(upload.single("avatar"), registerUser);
userRouter.route('/login').post(upload.none(), loginUser);
userRouter.route('/newAuthenticationTokens').get(refreshAccessToken);
userRouter.route('/userDetails/:username').get(getUserChannelProfile);

// Protected routes
userRouter.use(verifyJWT);

userRouter.route('/logout').get(logoutUser);
userRouter.route('/currentUserProfile').get(getCurrentUser);
userRouter.route('/changePassword').patch(upload.none(), changeUserPassword);
userRouter.route('/update-details').patch(upload.none(), updateCurrentUserDetail);
userRouter.route('/change-avatar').patch(upload.single("avatar"), updateUserAvatar);
