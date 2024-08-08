import { DietChart } from "../models/dietCharts.model.js";
import { DietChartItem } from "../models/dietChartItems.model.js";
import mongoose from "mongoose";
import { BaseDietChart } from "../models/baseDietCharts.model.js";
import sendDietChartMail from "../utils/mailUtils/sendDietChartMail.js";
import createDietChartPDF from "../utils/pdfUtils/createPdf.js";

const getDietChartsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const dietCharts = await DietChart.find({ user: userId });
        res.status(200).json({
            success: true,
            message: "Diet charts fetched successfully",
            dietCharts,
        });
    } catch (error) {
        console.log("Error in fetching diet charts middleware",error);
        res.status(500).json({ 
            message: "Error while fetching diet charts",
            error: error
        });
    }
}

const getDietChartsById = async (req, res) => {
    const { dietChartId } = req.params;
    try {
        const dietChart = await getDietChartWithPopulatedItems(dietChartId);
        
        console.log(dietChart);
        
        return res.status(200).json({
            success: true,
            message: "Diet chart fetched successfully",
            dietChart,
        });
    } catch (error) {
        console.log("Error in fetching diet chart by id middleware",error);
        res.status(500).json({
            message: "Error while fetching diet chart by id",
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

const sendDietChartEmail = async (req, res) => {
    const { dietChartId } = req.params;
    try {
        const dietChartItemIds = (await DietChart.findById(dietChartId)).items;
        const dietChart = await DietChart.findById(dietChartId)
        .populate([{
                path: 'user',
                model: 'User',
            },{
                path: 'items',
                model: 'DietChartItem',
                populate: {
                    path: 'dishes',
                    model: 'Dish',
                },
        }]);

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
        console.log(newDietChart);
        createDietChartPDF(newDietChart);
        const userEmail = newDietChart.user.email;
        const userName = newDietChart.user.name;
        await sendDietChartMail(userEmail,userName); // Replace with recipient email
        return res.status(200).json({message:`Diet chart sent to ${userName}`});
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error generating or sending PDF');
    }
}

async function getDietChartWithPopulatedItems (dietChartId) {
    const dietChartItemIds = (await DietChart.findById(dietChartId)).items;
    const dietChart = await DietChart.findById(dietChartId)
    .populate({
        path: 'items',
        model: 'DietChartItem',
        populate: {
            path: 'dishes',
            model: 'Dish',
        },
    });

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

export { getDietChartsByUser, createDietChart, deleteDietChart, getDietChartsById, sendDietChartEmail };