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
            type: String,
            required: true,
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
        },
        gender: {
            type: String,
            enum:["MALE","FEMALE","PREFER NOT TO SAY"],
            required: true,
        },
        mobile: {
            type: String,
        },
        medicalCondition: {
            type: String,
        },
    },
    {timestamps: true}
)

export const User = mongoose.model("User", userSchema)