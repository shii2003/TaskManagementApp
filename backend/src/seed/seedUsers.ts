import mongoose from "mongoose";
import dotenv from "dotenv";
import { hashPassword } from "../utils/hashPassword";
import User from "../models/User";
import { MONGO_URI } from "../constants/env";

dotenv.config();

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
                name: "Alice Johnson",
                email: "alice@example.com",
                password: await hashPassword("Password@123"),
            },
            {
                name: "Bob Smith",
                email: "bob@example.com",
                password: await hashPassword("Password@123"),
            },
            {
                name: "Charlie Brown",
                email: "charlie@example.com",
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
