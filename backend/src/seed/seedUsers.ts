import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { hashPassword } from "../utils/hashPassword";
import User from "../models/User";
import { MONGO_URI } from "../constants/env";


const seedUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            console.log("Users already exist. Skipping seeding.");
            process.exit(0);
        }

        const users = [
            {
                name: "John Doe",
                email: "john.doe@example.com",
                password: await hashPassword("Password@123"),
            },
            {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                password: await hashPassword("Password@123"),
            },
            {
                name: "Mike Johnson",
                email: "mike.johnson@example.com",
                password: await hashPassword("Password@123"),
            },
            {
                name: "Sarah Wilson",
                email: "sarah.wilson@example.com",
                password: await hashPassword("Password@123"),
            },
        ];

        await User.insertMany(users);
        console.log("Users seeded successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
