import mongoose from "mongoose";

const dietChartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        type: mongoose.Schema.Types.Mixed,
    }],
}, { timestamps: true });

export const DietChart = mongoose.model('DietChart', dietChartSchema);