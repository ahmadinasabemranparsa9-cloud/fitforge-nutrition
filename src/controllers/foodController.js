const {
    getFoods,
    getFoodByFdcId,
    getFoodCount,
    getFoodFilters,
} = require("../services/foodService");

const parsePositiveInteger = (value, defaultValue) => {
    if (value === undefined) {
        return defaultValue;
    }

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        return null;
    }

    return parsedValue;
};

const getFoodsHandler = async (req, res, next) => {
    try {
        const page = parsePositiveInteger(
            req.query.page,
            1
        );

        const limit = parsePositiveInteger(
            req.query.limit,
            10
        );

        if (page === null || limit === null) {
            return res.status(400).json({
                success: false,
                message: 
                    "Page and limit must be positive integers.",
            });
        }

        if (limit > 100) {
            return res.status(400).json({
                success: false,
                message: 
                    "Limit cannot exceed 100.",
            });
        }

        const result = await getFoods({
            page,
            limit,
            search: req.query.search || null,
            category: req.query.category || null,
            dataType: req.query.dataType || null,
            sort: 
                req.query.sort || 
                "description-asc",
        });

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        return next(error);
    }
};

const getFoodFiltersHandler = async (
    req, 
    res, 
    next
) => {
    try {
        const filters = await getFoodFilters();

        return res.status(200).json({
            success: true,
            data: filters,
        });
    } catch (error) {
        return next(error);
    }
};

const getFoodCountHandler = async (
    req, 
    res, 
    next
) => {
    try {
        const count = await getFoodCount();

        return res.status(200).json({
            success: true,
            data: {
                count,
            },
        });
    } catch (error) {
        return next(error);
    }
};

const getFoodByFdcIdHandler = async (
    req, 
    res, 
    next
) => {
    try {
        const food = await getFoodByFdcId(
            req.params.fdcId
        );

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: food,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getFoodsHandler,
    getFoodFiltersHandler,
    getFoodCountHandler,
    getFoodByFdcIdHandler,
};