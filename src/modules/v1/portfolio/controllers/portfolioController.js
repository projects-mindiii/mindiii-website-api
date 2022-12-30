import { sendResponse, sendErrorResponse } from "~/middlewares/responseHandler";
import { errorResponce } from "~/middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { protfolioService } from "../services/portfolioService";
import { LocaleService } from "~/utils/localeService";
import i18n from "~/config/i18n.config";


const portfolioServiceObj = new protfolioService(),
    localeService = new LocaleService(i18n)

// Portfolio list
const portfolioList = async (req, res, next) => {
    var responseData = {};

    portfolioServiceObj.portfolioList(req).then(async (returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK:

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('PRODUCT_LIST');
                responseData.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;


            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }


    }).catch((err) => { //set response for internal error 
        console.log(err);
        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);

    });
}


// Portfolio product detail
const portfolioDetail = async (req, res, next) => {
    var responseData = {};

    portfolioServiceObj.portfolioDetail(req).then(async (returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK:

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('PRODUCT_DATA');
                responseData.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;

            case StatusCodes.BAD_REQUEST:

                responseData.status_code = StatusCodes.BAD_REQUEST;
                responseData.message = localeService.translate(returnData.message);
                responseData.data = returnData.response;
                sendErrorResponse(req, res, StatusCodes.BAD_REQUEST, responseData);
                break;

            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }


    }).catch((err) => { //set response for internal error 
        console.log(err);
        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);

    });
}
// export all functions
const portfolioController = {
    portfolioList,
    portfolioDetail
}

export default portfolioController;