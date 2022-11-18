import AuthModel from "../models/AuthModel";
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
const AuthModelObj = new AuthModel();


const currentTime = DateTimeUtil.getCurrentTimeObjForDB();

/**
 * creating AuthModel object for access the database 
 */
export class authService {

    /*
     *send otp for email verification
     */
    async createOtpService(req) {

        // get random code 
        const code = await commonHelpers.getOtp();
        // set where condition for check exist and already used query  
        const where = {
            'email': req.body.email
        };
        // initialize response variable
        var res = '';
        // set insert otp code
        const insertData = {
            'otp': code,
        };

        try {
            // check email already used or not 
            const emailAlreadyUsed = await AuthModelObj.checkIsEmailUsed(where);
            // if email already used then  set response for email already used
            if (emailAlreadyUsed != undefined) {
                let res = {
                    status: false,
                    status_code: customResponseCode.EMAIL_EXIST,
                    response: ''
                };
                return res;
            }

            //  get email already sent or not, with 3 emails in 24 hours 
            const checkExist = await AuthModelObj.isExist(where, currentTime);

            // when email exist in table then proccess for update otp and email send count
            if (checkExist != undefined) {

                // check last email send time is lessthen 24 hours and count is not greterthen 3 then increase count and update
                if (checkExist.LastSendHour < commonConstants.OTP_LIMIT_REFRESH_IN_HOURS && checkExist.mail_count < commonConstants.OTP_EMAIL_LIMIT) {

                    insertData.mail_count = parseInt(checkExist.mail_count) + 1;
                    // update data in table
                    res = await AuthModelObj.updateObj(insertData, where, tableConstants.CRAVE_EMAIL_VARIFICATION_CODE)

                } else if (checkExist.LastSendHour >= commonConstants.OTP_LIMIT_REFRESH_IN_HOURS) {
                    //check if email send last hours is greater then 24 hours then update count and time 
                    insertData.mail_count = 1;
                    insertData.updated_at = currentTime;
                    // update data in table
                    res = await AuthModelObj.updateObj(insertData, where, tableConstants.CRAVE_EMAIL_VARIFICATION_CODE)

                } else { //when above both conditions do not match then it is set daily email send limit exceeded
                    let res = {
                        status: false,
                        status_code: customResponseCode.SYSTEM_VALIDATION,
                        response: ''
                    };
                    return res;
                }

            } else { //when email not exist in table then insert new row in table

                insertData.mail_count = 1;
                insertData.created_at = currentTime;
                insertData.updated_at = currentTime;
                insertData.email = req.body.email;
                res = await AuthModelObj.insertOtpDetail(insertData);
            }
            // set email details
            var mailOptions = {
                from: process.env.SMTP_FROM_MAIL, // sender address
                to: req.body.email, // list of receivers
                subject: 'Email Verification',
                template: 'verification', // the name of the template file i.e email.handlebars
                context: {
                    code: code,
                }

            };
            // use email liabrary and send email  
            return emailLib.sendEmail(mailOptions).then((emailReturn) => {
                // set success response 
                let res = {
                    status: true,
                    status_code: StatusCodes.OK,
                    response: emailReturn
                };
                return res;
            }).catch((error) => {
                logger.error(error);
                return error
            });

        } catch (error) {
            logger.error(error);
            return error
        }
    }

    /*
     *verify otp and normal signup step first 
     @requestData request body data
     @requestHeader request header data
     */
    async verifyOtpService(req) {
        // get data request data
        const email = req.body.email;
        const password = req.body.password;
        const otp = req.body.otp;
        const device_id = req.headers["device-id"];
        const device_type = req.headers["device-type"];
        const device_token = req.headers["device-token"];
        //set where for otp verifiaction query
        const where = {
            'email': email,
            'otp': otp,
        };

        try {
            // verify otp with email and 24 hours time limit
            const checkExist = await AuthModelObj.otpVerification(where, currentTime);

            // check when otp verify then proccess for user sign up
            if (checkExist != undefined) {


                let updateHeaderData = {
                    'device_token': '',
                    'device_id': ''
                };

                let wherQuery = {
                    'device_id': device_id
                };
                let orWherQuery = {
                    'device_token': device_token
                };
                // update divice id and token  if already used
                const updateResult = await AuthModelObj.updateHeader(updateHeaderData, wherQuery, orWherQuery);

                // create hash password using password hash liabrary
                const hashPassword = await passwordHash.cryptPassword(password);
                // set insert data 
                let saveData = {
                    'email': email,
                    'password': hashPassword,
                    'profile_step': commonConstants.PROFILE_STEP_ONE,
                    'signup_by': commonConstants.SIGNUP_TYPE_NORMAL,
                    'device_token': device_token,
                    'device_id': device_id,
                    'device_type': device_type,
                    'country': req.body.country,
                    'initial_lat': req.body.initial_lat,
                    'initial_long': req.body.initial_long,
                }

                // insert user details in table and make a normal sign up
                return AuthModelObj.createUser(saveData).then(async(returnData) => {

                    if (returnData != undefined) { //check if returnData not equal to undefined then proccess
                        // get user id from return data
                        let userId = returnData[0];
                        // set where condition to get user detail 
                        let userQuery = {
                            'id': userId
                        };
                        // get user detail from table
                        var userDetail = await AuthModelObj.getUserDetail(userQuery);
                        // genrate access token using jwt token liabrary
                        const token = await JwtAuthSecurity.generateJwtToken(userDetail);
                        userDetail.token = token; //set token in userresponse
                        // set response
                        let res = {
                            status: true,
                            status_code: StatusCodes.OK,
                            response: userDetail
                        };

                        return res;

                    } else { //set responsewhen user not registered

                        let res = {
                            status: false,
                            status_code: customResponseCode.DB_ERROR,
                            response: ''
                        };
                        return res;
                    }

                }).catch((err) => {
                    // set response when database related error come
                    let res = {
                        status: false,
                        status_code: customResponseCode.DB_ERROR,
                        response: ''
                    };

                    return res;
                });

            } else {
                // set response for system validation 
                let res = {
                    status: false,
                    status_code: customResponseCode.SYSTEM_VALIDATION,
                    response: ''
                };
                return res;
            }
        } catch (error) {
            logger.error(error);
            return error
        }
    }

    /*
    User Normal login 
    @requestData request body data
    @requestHeader request header data
    */
    async normalLoginService(req) {

        try {
            // set where condition for check exist a  
            const where = {
                'email': req.body.email
            };

            const device_id = req.headers["device-id"];
            const device_type = req.headers["device-type"];
            const device_token = req.headers["device-token"];

            return AuthModelObj.checkIsEmailUsed(where).then(async(userData) => {

                if (userData != undefined) { //user found then proccess for pasword verification
                    // match hash password and request body password
                    const isMatch = passwordHash.compareSync(req.body.password, userData.password);

                    if (isMatch) { //when password match then proccess for login

                        let updateHeaderData = {
                            'device_token': '',
                            'device_id': ''
                        };

                        let wherQuery = {
                            'device_id': device_id
                        };
                        let orWherQuery = {
                            'device_token': device_token
                        };
                        // update divice id and token  if already used
                        const updateResult = await AuthModelObj.updateHeader(updateHeaderData, wherQuery, orWherQuery);

                        let saveData = {
                            'device_token': device_token,
                            'device_id': device_id,
                            'device_type': device_type,
                        };
                        let userQuery = {
                            'id': userData.id
                        };
                        // update divece id and token in login user detail
                        const updateUserHeader = await AuthModelObj.updateObj(saveData, userQuery, tableConstants.CRAVE_USERS);

                        // get user detail from table
                        var userDetail = await AuthModelObj.getUserDetail(userQuery);
                        // genrate access token using jwt token liabrary
                        const token = await JwtAuthSecurity.generateJwtToken(userDetail);
                        userDetail.token = token; //set token in userresponse
                        // set response
                        let res = {
                            status: true,
                            status_code: StatusCodes.OK,
                            response: userDetail
                        };

                        return res;

                    } else {
                        // Password not match
                        let res = {
                            status: false,
                            status_code: customResponseCode.NOT_MATCHED,
                            response: ''
                        };
                        return res;
                    }
                } else {

                    // user not found 
                    let res = {
                        status: false,
                        status_code: StatusCodes.NOT_FOUND,
                        response: ''
                    };
                    return res;
                }

            }).catch((error) => {
                logger.error(error);
                return error;
            })

        } catch (error) {
            logger.error(error);
            return error;
        }
    }

}