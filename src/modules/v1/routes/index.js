import { Router } from "express";
import { auth } from "../auth/routes";
import { jobs } from "../jobs/routes";

const v1routes = new Router();
v1routes.use("/", auth);
v1routes.use("/", jobs);

export { v1routes };