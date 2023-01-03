import { Router } from "express";
import { auth } from "../auth/routes";
import { jobs } from "../jobs/routes";
import { galleryRoutes } from "../life@mindiii/galleryRoutes/galleryRoute";
import { portfolioRoutes } from "../portfolio/routes/portfolioRoute";

const v1routes = new Router();
v1routes.use("/", auth);
v1routes.use("/", jobs);
v1routes.use("/", portfolioRoutes);
v1routes.use("/", galleryRoutes);


export { v1routes };