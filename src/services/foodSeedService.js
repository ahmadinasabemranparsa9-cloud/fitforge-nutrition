const fs = require("fs");
const path = require("path");

const Food = require("../models/Food");

const foodsFilePath = path.join(
    __dirname,
    "../../data/foods.json"
);

const seedFoods = async () => {
    const fileContents = fs.readFileSync(
        foodsFilePath,
        "utf-8"
    );

    const parsedData = JSON.parse(fileContents);

    if (!Array.isArray(parsedData.FoundationFoods)) {
        throw new Error(
            "Food dataset must contain a FoundationFoods array."
        );
    }

    const validFoods = 
        parsedData.FoundationFoods.filter(
            (food) =>
                food !== null &&
                food.fdcId !== null &&
                food.fdcId !== undefined &&
                food.description
        );

    const skippedFoods = 
        parsedData.FoundationFoods.length - 
        validFoods.length;

    const operations = validFoods.map((food) => ({
        updateOne: {
            filter: {
                fdcId: food.fdcId,
            },
            update: {
                $set: food,
            },
            upsert: true,
        },
    }));

    if (operations.length > 0) {
        await Food.bulkWrite(
            operations,
            {
                ordered: false,
            }
        );
    }

    return {
        totalSourceRecords:
            parsedData.FoundationFoods.length,
        validRecords: validFoods.length,
        skippedRecords: skippedFoods,
        upsertedRecords: operations.length,
    };
};

module.exports = seedFoods;