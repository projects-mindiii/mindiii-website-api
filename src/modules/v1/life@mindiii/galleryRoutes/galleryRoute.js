import { Router } from "express";

import checkApiHeaders from "~/middlewares/checkApiHeaders"
import galleryController from "../galleryControllers/galleryController";

//  Contains all API routes for life@Mindiii

const galleryRoutes = new Router();

/*
 * Get list of all gallery images
 */

galleryRoutes.get('/gallery', checkApiHeaders, galleryController.galleryList);


export {
    galleryRoutes
};