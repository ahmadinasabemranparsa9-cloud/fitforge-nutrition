require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4003;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `FitForge Nutrition service running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start FitForge Nutrition service:",
            error.message
        );

        process.exit(1);
    }
};

startServer();