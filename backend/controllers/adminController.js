const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createSeller = async (req, res, next) => {
  try {
    const data = req.body;

    const exist = await User.findOne({ email: data.email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    data.password = await bcrypt.hash(data.password, 10);
    data.role = "seller";

    const seller = await User.create(data);

    res.status(201).json(seller);
  } catch (err) {
    next(err);
  }
};

exports.getSellers = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = 10;

    const sellers = await User.find({ role: "seller" })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(sellers);
  } catch (err) {
    next(err);
  }
};