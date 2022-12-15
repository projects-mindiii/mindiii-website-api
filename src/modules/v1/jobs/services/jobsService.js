import JobsModel from "../models/JobsModel";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';
import customResponseCode from '~/constants/customResponseCode';
import {
    StatusCodes
} from "http-status-codes";
import commonHelpers from '~/helpers/commonHelpers'
import DateTimeUtil from "~/utils/DateTimeUtil";
import passwordHash from "~/utils/passwordHash";
import Email from "~/libraries/Email";
import JwtAuthSecurity from "~/libraries/JwtAuthSecurity";
import logger from "~/utils/logger";

const emailLib = new Email();
const JwtAuthSecurityObj = new JwtAuthSecurity();
const JobsModelObj = new JobsModel();


const currentTime = DateTimeUtil.getCurrentTimeObjForDB();

/**
 * creating AuthModel object for access the database 
 */
export class jobsService {

    async jobsList(req){

        try{
            const jobsList = await JobsModelObj.fetchAllData(tableConstants.JOBS);
  

            let res = {
                status: true,
                status_code: StatusCodes.OK,
                response: jobsList
            };
            return res;
            
        } catch(error){

            console.log(error)
            return error;
        }
    }


    async jobsDetails(req){

        try{

            const where = {
                "id": req.body.id
            }
            const jobDetails = await JobsModelObj.fetchObj(where, tableConstants.JOBS);


            let res = {
                status: true,
                status_code: StatusCodes.OK,
                response: jobDetails
            };
            return res;
            
        } catch(error){

            console.log(error)
            return error;
        }
    }
}