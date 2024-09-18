import mongoose from "mongoose";
import { BaseDietChart } from "../models/baseDietCharts.model.js";
import { DietChartItem } from "../models/dietChartItems.model.js";
import { ObjectId } from 'mongodb'

const createBaseDietChart = async (req, res) => {
    const {cuisine, deficitCaloriesLevel, items} = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const existingDietChart = await BaseDietChart.findOne({ cuisine: cuisine, deficitCaloriesLevel: deficitCaloriesLevel });
        if (existingDietChart) {
            return res.status(400).json({
                success: false,
                message: "Diet chart already exists with same cuisine and deficit calories level",
            });
        }

        const insertedItems = [];

        for (const item of items) {
            if (!item) {
                insertedItems.push(null);
                continue;
            }
            if (!item.dishes || !item.calories) {
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

// TODO : shift this function to dietChartItems.controller.js
const addItemInBaseDietChart = async (req, res) => {
    const { dietChartId, itemId, index } = req.body;

    try {
        const dietChart = await BaseDietChart.findById(dietChartId);
        if (!dietChart) {
            return res.status(404).json({
                message: "Diet chart not found",
            });
        }
        dietChart.items[index] = new ObjectId(itemId);
        await dietChart.save();

        return res.status(200).json({
            success: true,
            message: "Item updated in diet chart successfully",
            dietChart,
        });        
    } catch (error) {
        console.log("Error in updating item in diet chart controller",error);
        return res.status(500).json({
            message: "Error while updating item in diet chart",
            error: error.message,
        });        
    }
}

const getAllBaseDietCharts = async (req, res) => {
    try {
        const dietCharts = await BaseDietChart.find({}).populate('cuisine').exec();
        console.log(dietCharts);
        return res.status(200).json({
            success: true,
            dietCharts: dietCharts,
        });
    } catch (error) {
        console.log("Error in fetching diet charts",error);
        return res.status(500).json({
            message: "Fetching diet charts failed",
            error: error.message,
        });
    }
}

const getBaseDietChartById = async (req, res) => {
    const {id} = req.params;
    try {
        const dietChart = await getBaseDietChartWithPopulatedItems(id);
        if (!dietChart) {
            return res.status(404).json({
                message: "Diet chart not found",
            });
        }
        return res.status(200).json({
            success: true,
            dietChart: dietChart,
        });
    } catch (error) {
        console.log("Error in fetching diet chart by id",error);
        return res.status(500).json({
            message: "Fetching diet chart by id failed",
            error: error.message,
        });
    }
}

async function getBaseDietChartWithPopulatedItems(dietChartId) {
    const dietChart = await BaseDietChart.findById(dietChartId)
    .populate([
        {
            path: 'cuisine',
            model: 'Cuisine',
        },
        {
            path: 'items',
            model: 'DietChartItem',
            populate: {
                path: 'dishes',
                populate:{
                    path: 'dish',                
                    model: 'Dish',
                }
            },
        }
    ]);
    if (!dietChart) {
        return null;
    }
    const dietChartItemIds = (await BaseDietChart.findById(dietChartId)).items;

    const items = []
    let itemsIndex = 0;
    for (const item of dietChartItemIds) {
        if (!item) {
            items.push(null);
            continue;
        }
        items.push(dietChart.items[itemsIndex]);
        itemsIndex++;
    };
    const newDietChart = {
        ...dietChart._doc,
        items:items,
    };
    return newDietChart;
}

export { createBaseDietChart, deleteBaseDietChart, addItemInBaseDietChart, getAllBaseDietCharts, getBaseDietChartById };