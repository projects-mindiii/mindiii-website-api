import { Router } from "express";

import checkApiHeaders from "~/middlewares/checkApiHeaders"
import portfolioController from "../controllers/portfolioController";

//  Contains all API routes for portfolio

const portfolioRoutes = new Router();

/*
 * Get list of all industries
 */

portfolioRoutes.get('/portfolio-list', checkApiHeaders, portfolioController.portfolioList);

//Detail of product
portfolioRoutes.get('/portfolio-detail/:product_key', checkApiHeaders, portfolioController.portfolioDetail);


export {
    portfolioRoutes
};