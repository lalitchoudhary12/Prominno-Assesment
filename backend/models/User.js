const mongoose = require("mongoose");

const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
    "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
    "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
    "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
];

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany"];

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true,
        match: [/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i, 'Please enter a valid email address']
    },
    phone: { 
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid 10 digit phone number']
    },
    country: { 
        type: String, 
        enum: COUNTRIES, 
        required: true 
    },
    state: {
        type: String,
        required: function() { return this.country === "India"; },
        validate: {
            validator: function(v) {
                if (this.country === "India") {
                    return INDIAN_STATES.includes(v);
                }
                return true;
            },
            message: props => `${props.value} is not a valid Indian state`
        }
    },
    skills: { 
        type: [String], 
        required: true 
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: { 
        type: String, 
        enum: ["admin", "seller"], 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);