import { DietChartItem } from "../models/dietChartItems.model.js";


// TODO : also add to dietChart 
const createDietChartItem = async (req, res) => {
    const { dishes, calories, dayDate, servingSize } = req.body;
    try {
        const dietChartItem = new DietChartItem({
            dishes,
            calories,
            dayDate,
            servingSize,
        });
        await dietChartItem.save();
        const populatedDietChartItem = await DietChartItem.findById(dietChartItem._id).populate({
            path: "dishes",
            populate: {
                path:"dish",
                model: "Dish",
            },
        });
        return res.status(201).json({
            success: true,
            message: "Diet chart item created successfully",
            dietChartItem: populatedDietChartItem,
        });
    } catch (error) {
        console.log("Error while creating diet chart item", error);
        return res.status(500).json({
            message: "Error while creating diet chart item",
            error: error,
        });
    }
}

const editDietChartItem = async (req, res) => {
    const { id } = req.params;
    const { dishes, calories, dayDate, servingSize } = req.body;
    console.log(req.body)
    try {
        const updatedDietChartItem = await DietChartItem.findById(id);
        if(!updatedDietChartItem) {
            return res.status(404).json({
                success: false,
                message: "Diet chart item not found",
            });
        }
        if(dishes) updatedDietChartItem.dishes = dishes;
        if(calories || calories === 0) updatedDietChartItem.calories = calories;
        if(dayDate) updatedDietChartItem.dayDate = dayDate;
        if(servingSize) updatedDietChartItem.servingSize = servingSize;
        await updatedDietChartItem.save();
        const populatedDietChartItem = await DietChartItem.findById(updatedDietChartItem._id).populate("dishes");
        return res.status(200).json({
            success: true,
            message: "Diet chart item updated successfully",
            dietChartItem: populatedDietChartItem,
        });
    }catch (error) {
        console.log("Error while updating diet chart item", error);
        return res.status(500).json({
            message: "Error while updating diet chart item",
            error: error
        });
    }
}

export { createDietChartItem, editDietChartItem };