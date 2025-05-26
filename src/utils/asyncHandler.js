
import { sendError } from "./sendErrorResp.js";

const asyncHandler = (requestHandler, options = {}) => {
    const { statusCode, message } = options;
    return (req, res, next) => {
        Promise
            .resolve(
                requestHandler(req, res, next)
            )
            .catch((err) => {
                // console.log("Following is err: ", err);
                // console.log("-----------------------------------------------------------------------------------------------------");

                return sendError(res, 500, err.message);
            });
    };
};



export { asyncHandler };