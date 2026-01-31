import express from 'express'
import jobController from '../controller/jobController.js';
import authMiddlewareFunction from '../middlewares/authMiddleware.js';
import middleware from '../middlewares/middleware.js';

const jobRouter = express.Router();

jobRouter.post(
    '/create-post', 
    authMiddlewareFunction , 
    middleware.recruiterOnly , 
    jobController.createJob
);

export default jobRouter;