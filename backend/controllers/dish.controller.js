import { Dish } from "../models/dish.model";

const createDish = async (req, res) => {
    const { name, cuisine, tags, caloriesPer100gram, ingredients } = req.body;
    try {
        const dish = new Dish({ name, cuisine, tags, caloriesPer100gram, ingredients });
        await dish.save();
        return res.status(201).json({
            success: true,
            data: dish,
            message: "Dish created successfully",
        });
    } catch (error) {
        console.log("Error in create dish controller",error);
        return res.status(400).json({ 
            message: "Error while creating dish", 
            error: error 
        });
    }
}

const getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();
        return res.status(200).json({
            success: true,
            data: dishes,
            message: "Dishes fetched successfully",
        });
    } catch (error) {
        console.log("Error in get all dishes controller",error);
        return res.status(404).json({ 
            message: "Error while fetching dishes", 
            error: error 
        });
    }
}

const deleteDish = async (req, res) => {
    try {
        const dish = await Dish.findByIdAndRemove(req.params.id);
        if (!dish) return res.status(404).send("Dish not found");
        return res.status(200).json({
            success: true,
            data: dish,
            message: "Dish deleted successfully",
        });
    }
    catch (error) {
        console.log("Error in delete dish controller",error);
        return res.status(404).json({ 
            message: "Error while deleting dish", 
            error: error 
        });
    }
}

export { createDish, getAllDishes, deleteDish };