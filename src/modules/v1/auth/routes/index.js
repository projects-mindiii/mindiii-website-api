import { Router } from "express";
import authController from "!/auth/controllers/authController";
import { varifyEmail } from "!/auth/validators/authValidator"
import { varifyOtpValidator } from "!/auth/validators/verifyOtpValidator"
import { loginValidator } from "!/auth/validators/loginValidator"
import checkApiHeaders from "~/middlewares/checkApiHeaders"

// create object for auth controller routes
const auth = new Router();
/*
 * create routes for send otp in user mail method in authController
 */
auth.post('/request-otp', varifyEmail, authController.sendOtp);

/*
 * create routes for otp verification and normal signup step method in authController
 */
auth.post('/verify-otp', checkApiHeaders, varifyOtpValidator, authController.verifyOtp);

/*
 * create routes for user normal login method in authController
 */
auth.post('/login', checkApiHeaders, loginValidator, authController.login);

export {
    auth
};