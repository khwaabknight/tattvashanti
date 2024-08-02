import { Cuisine } from "../models/cuisine.model";

const createCuisine = async (req, res) => {
    const { name, description, tags } = req.body;
    try {
        const cuisine = new Cuisine({ name, description, tags });
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

const editCuisine = async (req, res) => {
    const { name, description, tags } = req.body;
    try {
        const cuisine = await Cuisine.findByIdAndUpdate(req.params.id, req.body);
        if (!cuisine) return res.status(404).send("Cuisine not found");
        if (name) cuisine.name = name;
        if (description) cuisine.description = description;
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                if (!cuisine.tags.includes(tags[i])) {
                    cuisine.tags.push(tags[i]);
                }
            }
        }
        await cuisine.save();
        return res.status(200).json({
            success: true,
            data: cuisine,
            message: "Cuisine updated successfully",
        });
    }catch (error) {
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

export { createCuisine, editCuisine, getAllCuisines };