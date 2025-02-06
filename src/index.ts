import express from "express";
import dotenv from 'dotenv';

import connectDB from "./db/db";
import router from "./routes/userRouter";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/api', router);

const PORT = parseInt(process.env.PORT || '3000') || 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});