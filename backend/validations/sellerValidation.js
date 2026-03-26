const Joi = require("joi");

const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
    "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
    "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
    "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
];

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany"];

exports.createSellerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    country: Joi.string().valid(...COUNTRIES).required(),
    state: Joi.alternatives().conditional('country', {
        is: 'India',
        then: Joi.string().valid(...INDIAN_STATES).required(),
        otherwise: Joi.string().optional()
    }),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "seller").required()
}).options({ stripUnknown: true });