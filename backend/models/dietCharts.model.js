import mongoose from "mongoose";

const dietChartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dietPlan: {
        type: String,
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
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        calories: {
            type: Number,
            required: true,
        },
        dayDate: {
            type: Date,
            required: true,
        },
        timeOfDay: {
            type: String,
            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
            required: true,
        },
        servingSize: {
            type: Number,
            required: true,
        },
    }],
}, { timestamps: true });

export const DietChart = mongoose.model('DietChart', dietChartSchema);