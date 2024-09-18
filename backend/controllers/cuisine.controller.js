import { Cuisine } from "../models/cuisine.model.js";

const createCuisine = async (req, res) => {
    const { name, description, tags } = req.body;
    try {
        const cuisine = new Cuisine({ name: name.toUpperCase(), description, tags });
        await cuisine.save();
        return res.status(201).json({
            success: true,
            data: cuisine,
            message: "Cuisine created successfully",
        });
    } catch (error) {
        return res.status(400).json({ 
            message: "Error while creating cuisine", 
            error: error 
        });
    }
}

const deleteCuisine = async (req,res) => {
    const {id} = req.params;
    try {
        const cuisine = await Cuisine.findByIdAndDelete(id);
        if (!cuisine) return res.status(404).send("Cuisine not found");
        return res.status(200).json({
            success: true,
            data: cuisine,
            message: "Cuisine deleted successfully",
        });        
    } catch (error) {
        console.log("Error in delete cuisine controller",error);
        return res.status(404).json({ 
            message: "Error while updating cuisine", 
            error: error 
        });
    }
}

const getAllCuisines = async (req, res) => {
    try {
        const cuisines = await Cuisine.find();
        return res.status(200).json({
            success: true,
            data: cuisines,
            message: "Cuisines fetched successfully",
        });
    } catch (error) {
        console.log("Error in get all cuisines controller",error);
        return res.status(404).json({ 
            message: "Error while fetching cuisines", 
            error: error 
        });
    }
}

export { createCuisine, deleteCuisine, getAllCuisines };