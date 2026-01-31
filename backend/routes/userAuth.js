import express from "express";
import userController from '../controller/userController.js'
import authMiddlewareFunction from '../middlewares/authMiddleware.js';
import middleware from '../middlewares/middleware.js';
import upload from '../middlewares/upload.js'
const userRouter = express.Router();

userRouter.post('/signup', userController.userSignUp);
userRouter.post('/login', userController.userLogin);
userRouter.post('/forgot-pass', userController.userForgotPass);
userRouter.post('/verify-otp', userController.userVerifyOTP);
userRouter.post('/update-password', userController.userUpdatePassword);


userRouter.get(
    '/profile',
    authMiddlewareFunction,
    middleware.userOnly,
    userController.getUserProfile
);

userRouter.put(
    '/profile',
    authMiddlewareFunction,
    middleware.userOnly,
    userController.updateUserProfile
);

userRouter.get(
    '/jobs',
    authMiddlewareFunction,
    middleware.userOnly,
    userController.userGetJobs
);

userRouter.post(
    '/jobs/apply/:jobId',
    authMiddlewareFunction,
    middleware.userOnly,
    userController.userApplyJob
);

userRouter.get(
    '/applied-jobs',
    authMiddlewareFunction,
    middleware.userOnly,
    userController.userAppliedJob
);

userRouter.post(
    '/changepassword',
    authMiddlewareFunction,
    middleware.userOnly,
    userController.userChangePassword
);

export default userRouter;