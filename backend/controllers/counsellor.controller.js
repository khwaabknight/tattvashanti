import { Counsellor } from "../models/counsellor.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await Counsellor.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new Error(error)
    }
}

const createCounsellor = async (req, res) => {
    // get counsellor details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    try {
        const {name, email, password } = req.body;

        if (!name || !email || !password || [name, email, password].some((field) => field?.trim() === "")){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const existedCounsellor = await Counsellor.findOne({email: email})
        

        if (existedCounsellor) {
            return res.status(409).json({
                success:false,
                message:"Counsellor with email or username already exists",
            });
        }

        const createdCounsellor = await Counsellor.create({
            name,
            email,
            password,
        });

        if(!createdCounsellor){
            return res.status(500).json({
                success:false,
                message:"Something went wrong while registering the user",
            });
        }

        return res.status(201).json({
            success:true,
            message:"Counsellor registered Successfully",
            data: null
        });

    } catch (error) {
        console.log("Error occurred while registering counsellor : ",error)
        return res.status(500).json({
            error:error,
            success:false,
            message:"Something went wrong while registering the counsellor",
        });        
    }
}

const loginCounsellor = async (req, res) =>{
    // req body -> data
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body

    if (!email && !password) {
        return res.status(400).json({
            success:false,
            message:"email and password is required",
        });
    }

    try {
        const counsellor = await Counsellor.findOne({email:email})
    
        if (!counsellor) {
            return res.status(404).json({
                success:false,
                message:"Counsellor does not exist",
            });
        }
    
        const isPasswordValid = await counsellor.isPasswordCorrect(password)
    
        if (!isPasswordValid) {
            return res.status(401).json({
                success:false,
                message:"Invalid counsellor credentials",
            });
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(counsellor._id)

        const loggedInCounsellor = await Counsellor.findById(counsellor._id).select("-password -refreshToken -__v")

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, { ...options, })
        .cookie("refreshToken", refreshToken, { ...options,})
        .json({
            success:true,
            message:"User logged In Successfully",
            data: {
                loggedInCounsellor,
                accessToken
            }
        })
    } catch (error) {
        console.log("Error occurred while logging in the counsellor : ",error)
        return res.status(500).json({
            error,
            success:false,
            message:"Something went wrong while logging in the counsellor",
        });
    }
}

const logoutCounsellor = async(req, res) => {
    // remove refresh token from db
    // clear cookies
    // return res

    await Counsellor.findByIdAndUpdate(
        req.counsellor._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
        success:true,
        message:"User logged Out Successfully",
    })
}

const refreshAccessToken = async (req, res) => {
    // get refresh token from cookies or body
    // check if refresh token exists
    // verify refresh token
    // get user from db
    // check if user exists
    // check if refresh token is valid
    // generate new access and refresh token
    // send new access and refresh token
    

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success:false,
            message:"Refresh token is required",
        });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const counsellor = await Counsellor.findById(decodedToken?._id)
    
        if (!counsellor) {
            return res.status(401).json({
                success:false,
                message:"Invalid refresh token",
            });
        }
    
        if (incomingRefreshToken !== counsellor?.refreshToken) {
            return res.status(401).json({
                success:false,
                message:"Refresh token is expired or used",
            });
        }
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
        }
    
        const {accessToken, refreshToken:newRefreshToken} = await generateAccessAndRefereshTokens(counsellor._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            success:true,
            message:"Access token refreshed",
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        })
    } catch (error) {
        console.log("Error occurred while refreshing access token",error)
        return res.status(401).json({
            success:false,
            message:"Error occurred while refreshing access token",
        });
    }

}

const getCurrentCounsellor = async(req, res) => {
    return res
    .status(200)
    .json({
        success:true,
        message:"User fetched successfully",
        data: req.counsellor
    })
}


export {createCounsellor, loginCounsellor, logoutCounsellor, refreshAccessToken, getCurrentCounsellor}