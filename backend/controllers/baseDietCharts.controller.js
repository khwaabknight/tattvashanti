import mongoose from "mongoose";
import { BaseDietChart } from "../models/baseDietCharts.model.js";
import { DietChartItem } from "../models/dietChartItems.model.js";

const createBaseDietChart = async (req, res) => {
    const {cuisine, deficitCaloriesLevel, items} = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const insertedItems = []

        for (const item of items) {
            if (!item) {
                insertedItems.push(null);
                continue;
            }
            console.log(item)
            if (!item.dishes || !item.calories || !item.servingSize) {
                return res.status(400).json({
                    message: "Dish, quantity and meal type are required",
                });
            }
            const newItem = new DietChartItem({
                dishes: item.dishes,
                calories: item.calories,
                servingSize: item.servingSize,
            });
            insertedItems.push(newItem._id);
            await newItem.save({ session: session });
        };
        console.log("Data inserted")
        console.log(insertedItems)

        const newBaseDietChart = new BaseDietChart({
            cuisine,
            deficitCaloriesLevel,
            items: insertedItems,
        });
        await newBaseDietChart.save(
            { session: session }
        );
        await session.commitTransaction();
        return res.status(201).json({
            success: true,
            message: "Diet chart created successfully",
            dietChart: newBaseDietChart,
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in diet chart creation middleware",error);
        return res.status(500).json({
            message: "Diet chart creation failed",
            error: error.message,
        });
    } finally {
        await session.endSession();
    }
}

const deleteBaseDietChart = async (req, res) => {
    const {id} = req.params;
    try {
        const dietChart = await BaseDietChart.findByIdAndDelete(id);
        if (!dietChart) {
            return res.status(404).json({
                message: "Diet chart not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Diet chart deleted successfully",
        });
    } catch (error) {
        console.log("Error in deleting diet chart",error);
        return res.status(500).json({
            message: "Diet chart deletion failed",
            error: error.message,
        });
    }
}

export { createBaseDietChart, deleteBaseDietChart };