const Food = require("../models/Food");

const getFoods = async ({
    page = 1,
    limit = 10,
    search = null,
    category = null,
    dataType = null,
    sort = "description.asc",
} = {}) => {
    const filters = {};

    if (search) {
        filters.description = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    if (category) {
        filters["foodCategory.description"] = {
            $regex: `^${category.trim()}$`,
            $options: "i",
        };
    }

    if (dataType) {
        filters.dataType = {
            $regex: `^${dataType.trim()}$`,
            $options: "i"
        };
    }

    const sortDirection = 
        sort === "description-desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const [data, totalFoods] = await Promise.all([
        Food.find(filters)
            .sort({
                description: sortDirection,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Food.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(
        totalFoods / limit
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

const getFoodByFdcId = async (fdcId) => {
    return Food.findOne({
        fdcId: Number(fdcId),
    }).lean();
};

const getFoodCount = async () => {
    return Food.countDocuments();
};

const getFoodFilters = async () => {
    const [categories, dataTypes] = 
        await Promise.all([
            Food.distinct(
                "foodCategory.description"
            ),
            Food.distinct("dataType"),
        ]);

    return {
        categories: categories
            .filter(Boolean)
            .sort(),
        
        dataTypes: dataTypes
            .filter(Boolean)
            .sort(),
    };
};

module.exports = {
    getFoods,
    getFoodByFdcId,
    getFoodCount,
    getFoodFilters,
};