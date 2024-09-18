import jwt from "jsonwebtoken"
import { Counsellor } from "../models/counsellor.model.js";

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            return res.status(401).json({
                success:false,
                message:"Unauthorized request",
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const counsellor = await Counsellor.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!counsellor) {            
            return res.status(401).json({
                success:false,
                message:"Access Token is invalid",
            });
        }
        req.counsellor = counsellor;
        next()
    } catch (error) {
        console.log("Error in counsellorAuth middleware",error)
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the jsonwebtoken",
        });
    }
}