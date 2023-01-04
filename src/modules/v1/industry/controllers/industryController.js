import { sendResponse } from "~/middlewares/responseHandler";
import { errorResponce } from "~/middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { LocaleService } from "~/utils/localeService";
import i18n from "~/config/i18n.config";
import { industryService } from "../services/industryService";


const industryServiceObj = new industryService(),
    localeService = new LocaleService(i18n)

// Industry Controller
const industryList = async (req, res, next) => {
    var responseData = {};

    industryServiceObj.industryList(req).then(async (returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK:

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('INDUSTRY_LIST');
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

// export all functions
const industryController = {
    industryList,

}

export default industryController;