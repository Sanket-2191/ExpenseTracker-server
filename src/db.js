
import mongoose from "mongoose";


const url = process.env.MONGODB_ATLAS_URL;
export const ConnectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected to DB...");


    } catch (error) {
        throw new Error("DB connection failed.")
    }
}