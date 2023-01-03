import express from "express";
var http = require('http');
import bodyParser from "body-parser";
import { v1routes } from '!/routes';
import createHttpError from "http-errors";
import { notFound } from "./middlewares/errorHandler";
import { responseHandler } from "./middlewares/responseHandler";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import logger from "~/utils/logger";

var dotenv = require('dotenv').config();
const app = express(),
    APP_PORT = process.env.APP_PORT,
    APP_HOST = process.env.APP_HOST;
app.set("port", APP_PORT);
app.set("host", APP_HOST);
// set the view engine to ejs
app.set('view engine', 'ejs');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

/**
 * router managment for v1
 */


app.use("/", v1routes);
/*set error middleware*/
app.use(notFound); //return default error message not found

app.listen(app.get("port"), () => {
    console.log(`Server listing at http://${app.get("host")}:${app.get("port")}`)
})

process.on('uncaughtException', ex => {
    logger.error("uncaughtException: ",ex.message)
    process.exit(1);
})
  
process.on('unhandledRejection', reason => {
    logger.error("unhandledRejection: " + reason)
    process.exit(1);
})

export default app;