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
    },
    required: ["email"], //set email is required paramenter
    additionalProperties: false, //make addition parameter allow in request body by makeing additionalProperties =true 
}

// send otp field validation 
export const varifyEmail = function(req, res, next) {

    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (isValid.status == false) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }

    next();
}