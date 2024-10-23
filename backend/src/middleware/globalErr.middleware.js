import ApiErrorRes from "../utils/ApiErrorRes.js";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

function handleError (error, req, res, next) {
    console.log('global error', error);
    const resError = {
        status: 500,
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'DEVELOPMENT' ? error.stack : undefined
    };
    
    if(error instanceof ApiErrorRes) {
        resError.status = error.status;
        resError.success = error.success;
        resError.message = error.message;
        resError.stack = process.env.NODE_ENV === 'DEVELOPMENT' ? error.stack : undefined;
    }
    
    if(error instanceof mongoose.Error){
        resError.status = 500;
        resError.message = 'Internal server error';
        resError.success = false;
        process.env.NODE_ENV === 'DEVELOPMENT' && (resError.stack = error.stack);
       
    }

    return res.status(resError.status).json({...resError});
}

export {handleError};