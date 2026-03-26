const Joi = require("joi");

const brandSchema = Joi.object({
    brandName: Joi.string().required(),
    detail: Joi.string().required(),
    image: Joi.string().optional(),
    price: Joi.number().required()
});

exports.productSchema = Joi.object({
    productName: Joi.string().required(),
    productDescription: Joi.string().required(),
    // Accept either an array of brands (when sending JSON) or a JSON string (when sent as multipart/form-data)
    brands: Joi.alternatives().try(
        Joi.array().items(brandSchema).min(1),
        Joi.string()
    ).required()
}).messages({
    'any.required': 'Please provide all fields'
});
