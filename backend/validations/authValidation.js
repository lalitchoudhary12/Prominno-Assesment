const Joi = require("joi");

exports.loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().trim().min(6).required().messages({
       'string.empty': 'Password is required',
       'any.required': 'Password is required',
       'string.min': 'Invalid password'
    })
});