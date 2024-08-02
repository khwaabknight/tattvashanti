import mongoose from "mongoose";

const dietChartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxAllowedCalories: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietChartItem',
    }],
}, { timestamps: true });

export const DietChart = mongoose.model('DietChart', dietChartSchema);