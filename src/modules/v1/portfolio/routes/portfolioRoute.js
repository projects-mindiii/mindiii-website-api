import { Router } from "express";

import checkApiHeaders from "~/middlewares/checkApiHeaders"
import portfolioController from "../controllers/portfolioController";

//  Contains all API routes for BTF ticket history.

const portfolioRoutes = new Router();

/*
 * Get list of all industries
 */

portfolioRoutes.get('/portfolio-list', checkApiHeaders, portfolioController.portfolioList);

export {
    portfolioRoutes
};