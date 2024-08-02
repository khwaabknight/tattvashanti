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
    tags: [{
        type: String,
    }],
    caloriesPer100gram: {
        type: Number,
        required: true,
    },
    ingredients: [{
        type: String,
    }],
}, { timestamps: true });

export const Dish = mongoose.model('Dish', dishSchema);