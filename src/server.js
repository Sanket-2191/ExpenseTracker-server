import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';


export const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));


app.get('/', (req, res) => {
    return res.send("Server running....✅😊")
})


