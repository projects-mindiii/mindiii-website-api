import JwtAuthSecurity from '~/libraries/JwtAuthSecurity';
import {
    commonHelpers
} from '~/helpers/commonHelpers'
import {
    jobsService
} from '../services/jobsService';
import {
    sendResponse,
    sendErrorResponse
} from "~/middlewares/responseHandler";
import {
    errorResponce
} from "~/middlewares/errorHandler";
import {
    StatusCodes
} from "http-status-codes";
import customResponseCode from "~/constants/customResponseCode"
import i18n from "~/config/i18n.config";
import {
    LocaleService
} from "~/utils/localeService";
var localeService = new LocaleService(i18n);


var jobsServiceObj = new jobsService();


const jobsList = async(req, res, next) => {

    var responseData = {};

    jobsServiceObj.jobsList(req).then(async(returnData) => {
  
        switch (returnData.status_code) {
            case StatusCodes.OK: //set response when email send

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('JOBS_LISTED');
                responseData.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;

           
            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }


    }).catch((err) => { //set response for internal error 

        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);

    });

}


const jobsDetails = async(req, res, next) => {

    var responseData = {};

    jobsServiceObj.jobsDetails(req).then(async(returnData) => {
  
        switch (returnData.status_code) {
            case StatusCodes.OK: //set response when email send

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('JOB_DETAILS');
                responseData.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;

           
            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }


    }).catch((err) => { //set response for internal error 

        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);

    });

}


// export all functions
const jobsController = {
    jobsList,
    jobsDetails

}

export default jobsController