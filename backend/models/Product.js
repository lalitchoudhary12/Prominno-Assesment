const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { 
    type: String, 
    required: true 
  },
  productDescription: {
    type: String,
    required: true
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  brands: [
    {
      brandName: String,
      detail: String,
      image: String,
      price: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);