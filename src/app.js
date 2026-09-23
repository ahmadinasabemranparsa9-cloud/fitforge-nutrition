const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const foodRoutes = require("./routes/foodRoutes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

app.use(limiter);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "fitforge-nutrition",
        status: "healthy",
    });
});

app.use("/api/foods", foodRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error.",
    });
});

module.exports = app;