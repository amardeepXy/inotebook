import express from "express";
import { configDotenv } from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import { handleError } from "./middleware/globalErr.middleware.js";

import connectDB from "./db.js";
import {userRouter, noteRouter} from "./router/index.js";

const app = express();
const PORT = 3001 || process.env.PORT
configDotenv();

app.use(cors({origin: 'http://localhost'}));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(cookieParser());

app.use(handleError);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/note', noteRouter);

connectDB().then(() => {
    app.listen(PORT, () => console.log(`application is running on http://localhost:${PORT}`));
}).catch(() => console.log('Failed to connect to database'));
