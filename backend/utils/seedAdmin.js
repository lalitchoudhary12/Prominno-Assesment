const User = require("../models/User");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Default admin created");
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
};

module.exports = seedAdmin;