import { Router } from "express";
import { auth } from "../auth/routes";
const v1routes = new Router();
v1routes.use("/", auth);


export { v1routes };