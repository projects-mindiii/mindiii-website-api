import { sendResponse, sendErrorResponse } from "~/middlewares/responseHandler";
import { errorResponce } from "~/middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { LocaleService } from "~/utils/localeService";
import i18n from "~/config/i18n.config";
import { galleryService } from "../galleryServices/galleryService";


const galleryServiceObj = new galleryService(),
    localeService = new LocaleService(i18n)

// Gallery Controller
const galleryList = async (req, res, next) => {
    var responseData = {};

    galleryServiceObj.galleryList(req).then(async (returnData) => {

        switch (returnData.status_code) {
            case StatusCodes.OK:

                responseData.status_code = StatusCodes.OK;
                responseData.message = localeService.translate('GALLERY_LIST');
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
const galleryController = {
    galleryList,

}

export default galleryController;