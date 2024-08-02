import { DietChartItem } from "../models/dietChartItems.model.js";

const editDietChartItem = async (req, res) => {
    const { id } = req.params;
    const { dish, calories, dayDate, servingSize } = req.body;
    try {
        const updatedDietChartItem = await DietChartItem.findById(id);
        if(!updatedDietChartItem) {
            return res.status(404).json({
                success: false,
                message: "Diet chart item not found",
            });
        }
        if(dish) updatedDietChartItem.dish = dish;
        if(calories) updatedDietChartItem.calories = calories;
        if(dayDate) updatedDietChartItem.dayDate = dayDate;
        if(servingSize) updatedDietChartItem.servingSize = servingSize;
        await updatedDietChartItem.save();
        return res.status(200).json({
            success: true,
            message: "Diet chart item updated successfully",
            dietChartItem: updatedDietChartItem,
        });
    }catch (error) {
        console.log("Error while updating diet chart item", error);
        return res.status(500).json({
            message: "Error while updating diet chart item",
            error: error
        });
    }
}

export { editDietChartItem };