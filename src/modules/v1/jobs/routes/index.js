import { Router } from "express";
import jobsController from "!/jobs/controllers/jobsController";
import checkApiHeaders from "~/middlewares/checkApiHeaders"
// create object for auth controller routes
const jobs = new Router();

/*
 * create routes for send otp in user mail method in authController
 */
jobs.get('/jobs-list', jobsController.jobsList);


jobs.post('/job-details', jobsController.jobsDetails);

export {
    jobs
};