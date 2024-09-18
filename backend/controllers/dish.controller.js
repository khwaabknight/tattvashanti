import { Dish } from "../models/dish.model.js";
import { google } from 'googleapis';
import {Cuisine} from '../models/cuisine.model.js';

const createDish = async (req, res) => {
    const { name, cuisine, time, calories, unitOfMeasurement, grams } = req.body;
    try {
        const dish = new Dish({ name, cuisine, time, calories, unitOfMeasurement, grams });
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
    const { id } = req.params;
    try {
        const dish = await Dish.findByIdAndDelete(id);
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

const getMenuItemsFromSheets = async(req,res) => {

    const cuisineArray = {};
    const client_email = process.env.SHEETS_CLIENT_EMAIL;
    const private_key = process.env.SHEETS_PRIVATE_KEY.split(String.raw`\n`).join('\n');
  
    const auth = new google.auth.JWT(
        client_email,
        null,
        private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
  
    const sheets = google.sheets({ version: 'v4', auth });
  
    const spreadsheetId = "1xuosq7I2Qx4hUI60vsAqXuOFfWc-jHGwhQYM5KaHy98";
    const spreadsheetName = "Sheet1";
    const range = `${spreadsheetName}!A5:AI`;
  
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const rows = response.data.values;
  
        if (!rows.length) {
            console.log('No data found.');
        } else {
            for (const row of rows){
                try {                    
                    const name = row[0].trim();
                    const time = row[1].split("/").map((item) => item.trim().toLowerCase());
                    const calories = parseFloat(row[2].trim());
                    const category = row[3].toUpperCase().trim();
                    const unitOfMeasurement = row[5].trim();
                    const grams = parseFloat(row[6].trim());
  
                    if([name, time, calories, category, unitOfMeasurement, grams].includes("") || [name, time, calories, category, unitOfMeasurement, grams].includes(undefined)) {
                        break;
                    }
                    let cuisine = "";
  
                    if(!cuisineArray[category]) {
                        const fetchedCuisine = await Cuisine.findOne({name : category});
                        if(fetchedCuisine) {
                            cuisineArray[category] = fetchedCuisine._id;
                        }else{
                            console.log("Cuisine not found : ", category);
                            throw new Error("Cuisine not found");
                        }
                    }
                    cuisine = cuisineArray[category];
  
                    console.log(name,"|", time,"|",  calories,"calories |",  cuisine, "|",  category, "|", unitOfMeasurement, "|",  grams ,"grams");
  
                    await Dish.create({
                        name,
                        time,
                        calories,
                        cuisine,
                        unitOfMeasurement,
                        grams
                    });
  
                } catch (error) {
                    console.log("Error while creating dish", error);
                    continue;
                }
            }
        }
        return res.status(200).json({
            message: "Menu items created successfully",
            success: true,
        });
    } catch (error) {
        console.log("Error while getting menu items from sheets", error);
        return res.status(400).json({
            message: "Error while getting menu items from sheets",
            success: false,
            error: error.message,
        });
    }
}

export { createDish, getAllDishes, deleteDish, getMenuItemsFromSheets };