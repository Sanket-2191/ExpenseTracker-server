import multer from "multer";
import { ErrorHandler } from "../utils/ErrorHandlers.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log("Files received in multer midware:?", req.files || "files not received");
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        // console.log(file.mimetype.split("/"));

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + (file.mimetype).toString().split("/")[1])
    }
})

const upload = multer(
    {
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/webp" || file.mimetype === "image/png") {
                cb(null, true)
            } else {
                // @ts-ignore
                cb(new ErrorHandler(400, 'Unsupported file format for :', file.fieldname), false); // Reject file properly
            }
        }
    }
)

export { upload };