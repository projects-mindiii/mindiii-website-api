import { Router } from "express";
import checkApiHeaders from "~/middlewares/checkApiHeaders"
import industryController from "../controllers/industryController";

//  Contains all API routes for industry

const industryRoutes = new Router();

/*
 * Get list of all industry 
 */

industryRoutes.get('/industry', checkApiHeaders, industryController.industryList);

export {
    industryRoutes
};