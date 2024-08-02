import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true, 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        age: {
            type: Number,
        },
        weight: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        goal: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        modicalCondition: {
            type: String,
        },
    },
    {timestamps: true}
)

export const User = mongoose.model("User", userSchema)