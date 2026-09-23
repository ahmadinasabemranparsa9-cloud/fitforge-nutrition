const express = require("express");

const {
    getFoodsHandler,
    getFoodFiltersHandler,
    getFoodCountHandler,
    getFoodByFdcIdHandler,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoodsHandler);

router.get("/filters", getFoodFiltersHandler);

router.get("/count", getFoodCountHandler);

router.get("/:fdcid", getFoodByFdcIdHandler);

module.exports = router;