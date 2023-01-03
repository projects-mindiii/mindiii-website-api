import JwtAuthSecurity from '~/libraries/JwtAuthSecurity';
import {
    commonHelpers
} from '~/helpers/commonHelpers'
import {
    authService
} from '../services/authService';
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


var authServiceObj = new authService();

/*
 *send verification code in signup proccess
 */
const sendOtp = async(req, res, next) => {


    var responseData = {};

    authServiceObj.createOtpService(req).then(async(returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK: //set response when email send

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('VERIFY_EMAIL_SEND');
                responseData.data = {};
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;

            case customResponseCode.SYSTEM_VALIDATION: //set response when emailsend limit exceed 
                responseData.status_code = customResponseCode.SYSTEM_VALIDATION;
                responseData.message = localeService.translate('EXCEED_LIMIT');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.SEE_OTHER, responseData);
                break;
            case customResponseCode.EMAIL_EXIST: //set response when emailsend limit exceed 
                responseData.status_code = customResponseCode.EMAIL_EXIST;
                responseData.message = localeService.translate('EMAIL_EXIST');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.SEE_OTHER, responseData);
                break;

            default: //send default error response
                responseData.status_code = StatusCodes.FAILED_DEPENDENCY;
                responseData.message = localeService.translate('VERIFY_EMAIL_NOT_SEND');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.FAILED_DEPENDENCY, responseData);
                break;
        }


    }).catch((err) => { //set response for internal error 

        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);

    });

}

/*
 *Email verification and normal signup 
 */
const verifyOtp = async(req, res, next) => {

    var responseData = {};

    authServiceObj.verifyOtpService(req).then(async(returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK: //set response when email send

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('EMAIL_VERIFY');
                responseData.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;

            case customResponseCode.SYSTEM_VALIDATION: //set response when emailsend limit exceed 
                responseData.status_code = customResponseCode.SYSTEM_VALIDATION;
                responseData.message = localeService.translate('OTP_NOT_MATCH');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.SEE_OTHER, responseData);
                break;

            case customResponseCode.DB_ERROR: //set when user detail not save
                responseData.status_code = customResponseCode.DB_ERROR;
                responseData.message = localeService.translate('EMAIL_NOT_VERIFY');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.SEE_OTHER, responseData);
                break;

            default: //send default error response
                errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);
                break;
        }


    }).catch((err) => { //set response for internal error 

        errorResponce(req, res, StatusCodes.INTERNAL_SERVER_ERROR);

    });

}

const login = async(req, res, next) => {

    var responseData = {};
    authServiceObj.normalLoginService(req).then(async(returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK: //set success response 

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('LOGIN_SUCCESS');
                responseData.data = returnData.response;
                sendResponse(req, res, StatusCodes.OK, responseData);
                break;

            case customResponseCode.NOT_MATCHED: //set response when password not match
                responseData.status_code = customResponseCode.NOT_MATCHED;
                responseData.message = localeService.translate('NOT_MATCHED');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.SEE_OTHER, responseData);
                break;

            case StatusCodes.NOT_FOUND: //set response when user not found  
                responseData.status_code = StatusCodes.NOT_FOUND;
                responseData.message = localeService.translate('ACCONUT_NOT_FOUND');
                responseData.data = {};
                sendErrorResponse(req, res, StatusCodes.SEE_OTHER, responseData);
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
const authController = {
    sendOtp,
    verifyOtp,
    login

}

export default authController