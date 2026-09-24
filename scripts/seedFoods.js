require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const seedFoods = require("../src/services/foodSeedService");

const runSeed = async () => {
    try {
        await connectDB();

        const result = await seedFoods();

        console.log("Food seed completed successfully.");
        console.log(result);
    } catch (error) {
        console.error(
            "Food seed failed:",
            error.message
        );

        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

runSeed();