import mongoose, { Schema } from 'mongoose';

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    cuisine: {
        type: Schema.Types.ObjectId,
        ref: 'Cuisine',
    },
    time: [{
        type: String,
        enum: ['early morning','breakfast', 'mid morning', 'lunch', 'evening', 'dinner', 'post dinner'],
    }],
    calories: {
        type: Number,
        required: true,
        default: 0,
    },
    unitOfMeasurement: {
        type: String,
        required: true,
        default: 'serving',
    },
    grams: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

export const Dish = mongoose.model('Dish', dishSchema);