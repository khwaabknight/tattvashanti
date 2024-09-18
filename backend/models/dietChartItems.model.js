import mongoose from 'mongoose';

const dietChartItemSchema = new mongoose.Schema({
    dishes: [{
            dish:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Dish',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            unitOfMeasurement: {
                type: String,
                required: true,
            },
            grams: {
                type: Number,
                required: true,
            },
            remarks: {
                type: String,
            }
        }
    ],
    calories: {
        type: Number,
        required: true,
    },
    dayDate: {
        type: Date,
    },
});

export const DietChartItem = mongoose.model('DietChartItem', dietChartItemSchema);