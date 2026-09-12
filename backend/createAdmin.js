const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@easystay.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        await User.create({
            name: "Hotel Admin",
            email: "admin@easystay.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");
        console.log("Email: admin@easystay.com");
        console.log("Password: Admin@123");

        process.exit();

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();