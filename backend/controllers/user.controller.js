import { User } from "../models/user.model.js";
import { Counsellor } from "../models/counsellor.model.js";
import { google } from 'googleapis';
import fs from 'fs';

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

const getAllUsers = async (_, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
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

        const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
        const spreadsheetName = process.env.SHEETS_SPREADSHEET_NAME;

        // The range of cells to retrieve
        const result = await Counsellor.findOne({
            name: "lastRowInExcelFormResponses"
        });
        if(!result) {
            return res.status(400).json({
                message: "Error while getting last written row",
                success: false,
            });
        }
        let lastWrittenRow = result.password;
        console.log("Last written row", lastWrittenRow);
        const range = `${spreadsheetName}!A${lastWrittenRow}:AJ`;

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
    
            const rows = response.data.values;
            if (!rows.length) {
                console.log('No data found.');
            } else {
                for (const row of rows) {
                    const name = row[2];
                    const email = row[1];
                    const age = row[3];
                    const weight = row[5];
                    const height = row[27];
                    const gender = row[4].toUpperCase();
                    const mobile = row[6];
                    const medicalCondition = row[13];

                    if([name, email, age, weight, height, gender].includes("") || [name, email, age, weight, height,gender].includes(undefined)) {
                        break;
                    }
                    try {
                        await User.create({
                            name,
                            email,
                            age,
                            weight,
                            height,
                            gender,
                            mobile,
                            medicalCondition,
                        });
                        await Counsellor.findOneAndUpdate({
                            name: "lastRowInExcelFormResponses"
                        }, {
                            password: parseInt(lastWrittenRow) + 1
                        });
                        lastWrittenRow = parseInt(lastWrittenRow) + 1;
                    } catch (error) {
                        console.log("Error while creating user", error);
                        return res.status(400).json({
                            message: "Error while creating user",
                            success: false,
                            error: error.message,
                        });                        
                    }
                };
            }
        } catch (err) {
            console.error('The API returned an error:', err);
            return res.status(400).json({
                message: "Error while getting users from sheets",
                success: false,
                error: err.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
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