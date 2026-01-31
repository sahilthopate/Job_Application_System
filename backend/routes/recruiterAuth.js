import express from 'express'
import recruiterController from '../controller/recruiterController.js';
import authMiddlewareFunction from '../middlewares/authMiddleware.js';
import middleware from '../middlewares/middleware.js'
const recruiterRouter = express.Router();

recruiterRouter.post('/recruiter-signup',recruiterController.recruiterSignup);
recruiterRouter.post('/recruiter-login',recruiterController.recruiterLogin);
recruiterRouter.post('/recruiter-forgot-password',recruiterController.recruiterForgotPass);
recruiterRouter.post('/recruiter-verify-otp',recruiterController.recruiterVerifyOTP);
recruiterRouter.post('/recruiter-update-password',recruiterController.recruiterUpdatePassword);

recruiterRouter.get(
    '/applications',
    authMiddlewareFunction,
    middleware.recruiterOnly,
    recruiterController.recruiterGetApplicantData
);

recruiterRouter.get(
    '/jobs',
    authMiddlewareFunction,
    middleware.recruiterOnly,
    recruiterController.recruiterPostedJobs
);

recruiterRouter.post(
    '/:jobId/edit',
    authMiddlewareFunction,
    middleware.recruiterOnly,
    recruiterController.recruiterEditJob
)

recruiterRouter.put(
    '/applications/:applicationId',
    authMiddlewareFunction,
    middleware.recruiterOnly,
    recruiterController.recruiterSentResult
);

recruiterRouter.delete(
    '/:jobId',
    authMiddlewareFunction,
    middleware.recruiterOnly,
    recruiterController.recruiterDeleteJob
);

export default recruiterRouter;