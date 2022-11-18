import validateSchema from '~/utils/validate'
// create schema for request opt api
const schema = {
    type: "object",
    properties: {
        email: {
            type: "string",
            maxLength: 50,
            format: "email",
            errorMessage: {
                type: 'The email field must be a string',
                maxLength: 'Email field maximum 50 characters allowed.',
                format: 'Invalid email format.',
            },
        },
        password: {
            type: "string",
            minLength: 4,
            maxLength: 8,
            pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%^&*@])",
            errorMessage: {
                type: 'The password field must be a string.',
                minLength: 'Password should minimum of 4 characters.',
                maxLength: 'Password should be a maximum of 8 characters.',
                pattern: 'Password must contain at least one uppercase, lowercase, number, and a special character.',
            },
        },
        confirm_password: {
            const: {
                "$data": "1/password"
            },
            type: "string",
            minLength: 4,
            maxLength: 8,
            pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%^&*@])",
            errorMessage: {
                const: 'The password does not match with the confirmed password.',
                type: 'The confirm password field must be a string.',
                minLength: 'Confirm password should minimum of 4 characters.',
                maxLength: 'Confirm password  should be a maximum of 8 characters.',
                pattern: 'Confirm password  must contain at least one uppercase, lowercase, number, and a special character.',
            },
        },
        otp: {
            type: "string",
            minLength: 4,
            maxLength: 4,
            errorMessage: {
                type: 'The otp field must be a string.',
                minLength: 'Otp should minimum of 4 characters.',
                maxLength: 'Otp should be a maximum of 4 characters.',
            },
        },
    },
    required: ["email", "password", "confirm_password", "otp"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}

// send otp field validation 
export const varifyOtpValidator = function(req, res, next) {

    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (isValid.status == false) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}