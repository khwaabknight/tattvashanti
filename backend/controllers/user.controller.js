import { User } from "../models/user.model.js";
import { google } from 'googleapis';

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

const getUsersFromSheets = async (req, res) => {

    try {
        const client_email = process.env.SHEETS_CLIENT_EMAIL;
        const private_key = process.env.SHEETS_PRIVATE_KEY.split(String.raw`\n`).join('\n');

        const auth = new google.auth.JWT(
            client_email,
            null,
            private_key,
            ['https://www.googleapis.com/auth/spreadsheets.readonly']
        );

        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1SI9EUEG2Msfo_n1wxorDjh0WuuZk_aYa5uNlIYZit00';

        // The range of cells to retrieve
        const range = 'Sheet1!A1:B';

        // console.log(auth)
        // console.log(sheets)

        async function getSpreadsheetData() {
            try {
                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId,
                    range,
                });
                
        
                const rows = response.data.values;
                if (rows.length) {
                    rows.forEach(row => {
                        // Print columns A and E, which correspond to indices 0 and 4.
                        console.log(`${row[0]}, ${row[4]}`);
                    });
                } else {
                    console.log('No data found.');
                }
            } catch (err) {
                console.error('The API returned an error:', err);
            }
        }
        
        getSpreadsheetData();



        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            auth,
        });
        
    } catch (error) {
        console.log("Error while getting users from sheets", error);
        return res.status(400).json({
            message: "Error while getting users from sheets",
            success: false,
            error: error.message,
        });        
    }
}

export { createUser, getAllUsers, deleteUser, getUsersFromSheets };