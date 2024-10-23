import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import { validateUserCreation, checkUserDuplication, validateLoginData } from "../validator/index.js";
import ApiErrorRes from "./../utils/ApiErrorRes.js";
import ApiResponse from "../utils/ApiResponse.js";
import { decryptJWT } from "../utils/decryptJWT.js";

configDotenv();

// Working
const createUser = asyncHandler( async function (req, res) {
    if(!req.body) throw new Error('User data is required');
    const userData = {name: req.body?.name, username: req.body?.username, email: req.body?.email, password: req.body?.password };

    const testResult = validateUserCreation(userData);
    if(!testResult.isValid) return res.status(400).json(new ApiErrorRes(400, testResult.message));

    try {
        
        const newUser = await User.create(userData); 

        if(!newUser) throw new Error('User not created');
        return res.status(201).json(new ApiResponse(201, 'User created successfully', {
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            notes: newUser.notes
        }));
    } catch (error) {
        
        const errorMessage = checkUserDuplication(error);
        return res.status(400).json(new ApiErrorRes(400, errorMessage));
    }

});

const getUserById = asyncHandler(async function (req, res){
    // Check userId in param
 if(!req.params.userId) return res.status(400).json(new ApiErrorRes(400, 'User ID is required'));

 const userId = req.params.userId;

 // Check if userId is valid
 if(!mongoose.isValidObjectId(userId))
    return res.status(400).json(new ApiErrorRes(400, 'Invalid user ID'));

 try {

    // Find user
    const user = await User.findById(userId).select('-password');
    // Return error response if user not found
    if(!user) return res.status(404).json(new ApiErrorRes(404, 'User not found'));
    // Return found user
    return res.status(200).json(new ApiResponse(200, 'User found successfully', user));

 } catch (error) {
    return res.status(500).json(new ApiErrorRes(500, error.message));
 }

});

const loginUser = asyncHandler(async function (req, res){
    const test = validateLoginData(req.body);
    if(!test.status) return res.status(400).json(new ApiErrorRes(400, test.message));

    let user;
    try {
        user = await User.findOne({$or: [
        { username: test.credentials.username },
        { email: test.credentials.email }
    ]});

        if(!user) return res.status(401).json(new ApiErrorRes(401, 'Check your email or username properly'));

        const isPassMatch = await user.comparePassword(test.credentials.password);
        if(!isPassMatch) return res.status(401).json(new ApiErrorRes(401, 'Incorrect password'));

    } catch (error) {
        return res.status(500).json(new ApiErrorRes(500, error.message));
    }
    
    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "7d"});

    return res.cookie("auth", token, {httpOnly: true, secure: process.env.NODE_ENV === "production", strict: true, sameSite: "strict"})
        .status(200)
        .json(new ApiResponse(200, 'User logged in successfully', {token}));
});

const getLoggedInUser = asyncHandler(async function (req, res){
    if(!req.cookies || !req.cookies.auth) return res.status(401).json(new ApiErrorRes(401, 'User is not logged in'));
    const token = req.cookies.auth;
    if(!token) return res.status(401).json(new ApiErrorRes(401, 'User is not logged in'));

    const jwtData = await decryptJWT(token);
   
    if(!jwtData) return res.status(401).json(new ApiErrorRes(401, 'User is not logged in'));
    try {
        const user = await User.findById(jwtData.id).select('-password');
        if(!user) return res.status(404).json(new ApiErrorRes(404, 'There is some problem in user account'));
        return res.status(200).json(new ApiResponse(200, 'User found successfully', user));
    } catch (error) {
        console.log('get logged in user error', error);
        return res.status(500).json(new ApiErrorRes(500, error.message));
    }
});

export {
    createUser, 
    getUserById,
    loginUser,
    getLoggedInUser
}