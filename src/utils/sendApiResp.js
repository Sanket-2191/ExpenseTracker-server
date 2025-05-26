import { APIresponse } from "./APIresponse.js";

export const sendAPIResp = (res, statusCode, message, data) => {
    return res.status(statusCode)
        .json(
            new APIresponse(statusCode, data, message)
        );
};