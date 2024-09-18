import mongoose from "mongoose";

const cuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
});

export const Cuisine = mongoose.model('Cuisine', cuisineSchema);