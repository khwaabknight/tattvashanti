import mongoose from 'mongoose';

const dietChartItemSchema = new mongoose.Schema({
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
    }],
    calories: {
        type: Number,
        required: true,
    },
    dayDate: {
        type: Date,
    },
    servingSize: {
        type: Number,
        required: true,
    }, // in grams
});

export const DietChartItem = mongoose.model('DietChartItem', dietChartItemSchema);