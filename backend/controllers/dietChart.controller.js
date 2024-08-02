import { DietChart } from "../models/dietCharts.model.js";
import { DietChartItem } from "../models/dietChartItems.model.js";
import mongoose from "mongoose";

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
    const {userId:user,maxAllowedCalories,startDate,endDate,items} = req.body;
    // const session = await mongoose.startSession();
    try {
        // session.startTransaction();

        // let dietChartItemsIds;

        const insertedItems = await DietChartItem.insertMany(items, 
            // { session: session }
        )
        // .then(function (res) {
            console.log("Data inserted") // Success 
            console.log(insertedItems)
        // }).catch(function (error) {
            //     console.log(error)     // Failure 
            // });
            
        const dietChartItemsIds = insertedItems.map(item => item._id);
        console.log("Diet chart items",dietChartItemsIds);

        const newDietChart = new DietChart({
            user,
            maxAllowedCalories,
            startDate:new Date(startDate),
            endDate:new Date(endDate),
            items: dietChartItemsIds,
        });
        await newDietChart.save(
            // { session: session }
        );
        // await session.commitTransaction();
        return res.status(201).json({
            success: true,
            message: "Diet chart created successfully",
            dietChart: newDietChart,
        });
    } catch (error) {
        // await session.abortTransaction();
        console.log("Error in diet chart creation middleware",error);
        return res.status(500).json({
            message: "Diet chart creation failed",
            error: error.message,
        });
    } finally {
        // await session.endSession();
    }
}

const updateDietChart = async (req, res) => {
    const {dietChartId,maxAllowedCalories,startDate,endDate} = req.body;
    try {
        const dietChart = await DietChart.findById(dietChartId);
        if (!dietChart) {
            return res.status(404).json({
                message: "Diet chart not found",
            });
        }
        if(maxAllowedCalories) dietChart.maxAllowedCalories = maxAllowedCalories;
        if(startDate) dietChart.startDate = startDate;
        if(endDate) dietChart.endDate = endDate;
        await dietChart.save();
        return res.status(200).json({
            success: true,
            message: "Diet chart updated successfully",
            dietChart: dietChart,
        });
    } catch (error) {
        console.log("Error in diet chart update middleware",error);
        return res.status(500).json({
            message: "Diet chart update failed",
            error: error.message,
        });
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

export { getDietChartsByUser, createDietChart, updateDietChart, deleteDietChart };