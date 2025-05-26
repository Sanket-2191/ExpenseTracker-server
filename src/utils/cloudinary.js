import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

import { sendError } from './sendErrorResp.js';



cloudinary.config({
    cloud_name: 'din14pksa',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' })
        // console.log("URL created on cloudinary: ", response.url);
        return response;

    } catch (error) {
        // console.log("removed local file after failing to create URL");
        return sendError(500, "File upload failed");
    } finally {
        try {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                // console.log("Removed local file after upload.");
            }
        } catch (cleanupError) {
            console.log("Error removing local file:", cleanupError);
        }
        // to remove the locally saved temp file from multer as upload operation failed
    }
}

export { uploadOnCloudinary }

