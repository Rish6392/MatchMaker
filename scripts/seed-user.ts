import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { connectDB } from "../lib/db";
import User from "../models/User";
import bcrypt from "bcryptjs";

const seedUser = async () => {
    try {
        await connectDB();
        console.log("Connected to DB, creating default user...");

        // Check if admin user already exists
        const existingUser = await User.findOne({ username: "admin" });
        if (existingUser) {
            console.log("Admin user already exists. Skipping creation.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("password123", 10);

        await User.create({
            username: "admin",
            password: hashedPassword,
            role: "matchmaker",
        });

        console.log("Successfully created default user: admin / password123");
        process.exit(0);
    } catch (error) {
        console.error("Error creating user:", error);
        process.exit(1);
    }
};

seedUser();
