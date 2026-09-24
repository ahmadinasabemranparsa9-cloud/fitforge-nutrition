const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        fdcId: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },

        foodClass: {
            type: String,
            default: null,
        },

        description: {
            type: String,
            required: true,
            index: true,
        },

        foodNutrients: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },

        scientificName: {
            type: String,
            default: null,
        },

        foodAttributes: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },

        nutrientConversionFactors: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },

        isHistoricalReference: {
            type: Boolean,
            default: false,
        },

        ndbNumber: {
            type: Number,
            default: null,
        },

        foodCategory: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        foodPortions: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },

        publicationDate: {
            type: String,
            default: null,
        },

        inputFoods: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

foodSchema.index({
    description: 1,
});

foodSchema.index({
    "FoodCategory.description": 1,
});

module.exports = mongoose.model("Food", foodSchema);