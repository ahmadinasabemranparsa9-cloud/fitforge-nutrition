const fs = require("fs");
const path = require("path");

const foodsFilePath = path.join(
    __dirname,
    "../../data/foods.json"
);

const loadFoods = () => {
    const fileContents = fs.readFileSync(
        foodsFilePath,
        "utf-8"
    );

    const parsedData = JSON.parse(fileContents);

    if (!Array.isArray(parsedData.FoundationFoods)) {
        throw new Error(
            "Food catalog must contain a FoundationFoods array."
        );
    }

    return parsedData.FoundationFoods.filter(
        (food) => food !== null
    );
};

const getFoods = ({
    page = 1,
    limit = 10,
    search = null,
    category = null,
    dataType = null,
    sort = "description-asc",
} = {}) => {
    let foods = loadFoods();

    if (search) {
        const normalizedSearch = search.trim().toLowerCase();

        foods = foods.filter(
            (food) =>
                food.description && 
                food.description
                    .toLowerCase()
                    .includes(normalizedSearch)
        );
    }

    if (category) {
        const normalizedCategory = 
            category.trim().toLowerCase();

        foods = foods.filter(
            (food) =>
                food.foodCategory?.description &&
                food.foodCategory.description
                    .toLowerCase() === normalizedCategory
        );
    }

    if (dataType) {
        const normalizedDataType = 
            dataType.trim().toLowerCase();
        
        foods = foods.filter(
            (food) =>
                food.dataType &&
                food.dataType.toLowerCase() === 
                    normalizedDataType
        );
    }

    foods.sort((a, b) => {
        const comparison = a.description.localeCompare(
            b.description,
            undefined,
            {
                sensitivity: "base",
            }
        );

        return sort === "description-desc"
            ? -comparison
            : comparison;
    });

    const totalFoods = foods.length;

    const totalPages = Math.ceil(
        totalFoods / limit
    );

    const skip = (page - 1) * limit;

    const data = foods.slice(
        skip,
        skip + limit
    );

    return {
        data,
        pagination: {
            page,
            limit,
            totalFoods,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};

const getFoodByFdcId = (fdcId) => {
    const foods = loadFoods();

    return foods.find(
        (food) => food.fdcId === Number(fdcId)
    );
};

const getFoodCount = () => {
    return loadFoods().length;
};

const getFoodFilters = () => {
    const foods = loadFoods();

    const categories = new Set();
    const dataTypes = new Set();

    foods.forEach((food) => {
        if (food.foodCategory?.description) {
            categories.add(
                food.foodCategory.description
            );
        }

        if (food.dataType) {
            dataTypes.add(food.dataType);
        }
    });

    return {
        categories: [...categories].sort(),
        dataTypes: [...dataTypes].sort(),
    };
};

module.exports = {
    getFoods,
    getFoodByFdcId,
    getFoodCount,
    getFoodFilters,
};