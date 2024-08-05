import { DietChart } from "../models/dietCharts.model.js";
import { DietChartItem } from "../models/dietChartItems.model.js";
import mongoose from "mongoose";
import { BaseDietChart } from "../models/baseDietCharts.model.js";

const getDietChartsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const dietCharts = await DietChart.find({ user: userId }).populate({
            path: 'items',
            populate: {
                path: 'dish',
            }
        });
        res.status(200).json({
            success: true,
            message: "Diet charts fetched successfully",
            dietCharts,
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error while fetching diet charts",
            error: error
        });
    }
}

const createDietChart = async (req, res) => {
    const {userId:user,startDate,endDate,cuisine,deficit} = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const baseDietChartItemIds = (await BaseDietChart.findOne({ cuisine, deficitCaloriesLevel: deficit })).items;
        const baseDietChart = await BaseDietChart.findOne({ cuisine, deficitCaloriesLevel: deficit })
        .populate({
            path: 'items',
            model: 'DietChartItem',
        });

        const items = []
        let itemsIndex = 0;
        for (const item of baseDietChartItemIds) {
            if (!item) {
                items.push(null);
                continue;
            }
            const newItem = new DietChartItem({
                dishes: baseDietChart.items[itemsIndex].dishes,
                calories: baseDietChart.items[itemsIndex].calories,
                servingSize: baseDietChart.items[itemsIndex].servingSize,
            });
            itemsIndex++;
            items.push(newItem._id);
            await newItem.save({ session: session });
            itemsIndex++;
        };

        const newDietChart = new DietChart({
            user,
            startDate:new Date(startDate),
            endDate:new Date(endDate),
            items: items,
        });
        await newDietChart.save(
            { session: session }
        );
        await session.commitTransaction();
        return res.status(201).json({
            success: true,
            message: "Diet chart created successfully",
            dietChart: newDietChart,
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


const deleteDietChart = async (req, res) => {
    const {id} = req.params;
    try {
        const dietChart = await DietChart.findById(id);
        if (!dietChart) {
            return res.status(404).json({
                message: "Diet chart not found",
            });
        }
        await dietChart.delete();
        return res.status(200).json({
            success: true,
            message: "Diet chart deleted successfully",
        });
    } catch (error) {
        console.log("Error in diet chart deletion middleware",error);
        return res.status(500).json({
            message: "Diet chart deletion failed",
            error: error.message,
        });
    }
}

export { getDietChartsByUser, createDietChart, deleteDietChart };