import { StatusCodes } from "http-status-codes";
import tableConstants from "../../../../constants/tableConstants";
import industryModel from "../models/industryModel";

const industryModelObj = new industryModel();

export class industryService {

    // Industry list 
    async industryList(req) {

        var industryData = await industryModelObj.fetchindustryListWithSelectedFields({ "status": 1, "is_delete": 0 }, ['id', 'name'], tableConstants.TB_CATEGORIES);

        let res = {
            status: true,
            status_code: StatusCodes.OK,
            response: industryData
        };
        return res;
    }
}