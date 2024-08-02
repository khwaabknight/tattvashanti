import { User } from "../models/user.model.js";

const createUser = async (req, res) => {
    const { name, email, age, weight, height, goal, gender, mobile, medicalCondition } = req.body;
    try {
        if([name, email, age, weight, height, goal, gender].includes(undefined)) {
            return res.status(400).json({
                message: "Please fill all the required fields",
                success: false,
            });
        }
        const userExists = await User.findOne({ email: email });
        if(userExists) {
            return res.status(400).json({
                message: "User with this email already exists",
                success: false,
            });
        }
        const user = await User.create({
            name,
            email,
            age,
            weight,
            height,
            goal,
            gender,
            mobile,
            medicalCondition,
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        console.log("Error while creating user", error);
        return res.status(400).json({
            message: "Error while creating user",
            success: false,
            error: error.message,
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.log("Error while getting users", error);
        return res.status(400).json({
            message: "Error while fetching users",
            success: false,
            error: error.message,
        });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user,
        });
    }    catch (error) {
        console.log("Error while deleting user", error);
        return res.status(400).json({
            message: "Error while deleting user",
            success: false,
            error: error.message,
        });
    }
}

export { createUser, getAllUsers, deleteUser };