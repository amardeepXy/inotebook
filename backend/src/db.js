import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGOURI);
        console.log('MongoDB connected successfully ✅');
    }catch(err){
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
}

export default connectDB;