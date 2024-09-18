import mongoose from "mongoose";

const baseDietChartSchema = new mongoose.Schema({
    cuisine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuisine',
        required: true,
    },
    deficitCaloriesLevel: {
        type: String,
        enum: ['L1', 'L2', 'L3'],
        required: true,
    },
    items: [{
        type: mongoose.Schema.Types.Mixed,
    }],
}, { timestamps: true });

export const BaseDietChart = mongoose.model('BaseDietChart', baseDietChartSchema);