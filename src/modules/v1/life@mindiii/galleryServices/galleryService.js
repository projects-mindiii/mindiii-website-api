import { StatusCodes } from "http-status-codes";
import folderConstants from "../../../../constants/folderConstants";
import tableConstants from "../../../../constants/tableConstants";
import galleryModel from "../galleryModels/galleryModel";

const galleryModelObj = new galleryModel();

export class galleryService {


    // Gallery list 
    async galleryList(req) {

        var galleryImage = await galleryModelObj.fetchGalleryListWithSelectedFields({ "is_active": 1 }, ['image', 'title', 'alt', 'description'], tableConstants.TB_GALLERIES);

        if (galleryImage.length > 0) {

            galleryImage.forEach(element => {
                element.image = folderConstants.GALLERY_IMAGE + `${element.image}`

            });
        }
        let res = {
            status: true,
            status_code: StatusCodes.OK,
            response: galleryImage
        };
        return res;
    }
}