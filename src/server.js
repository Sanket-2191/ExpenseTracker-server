import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';


export const app = express();

console.log("In srever");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));


app.get('/', (req, res) => {
    return res.send("Server running....✅😊");
})



import { userRouter } from './routes/user.routes.js';
import { transactionRouter } from './routes/transaction.routes.js';
import { budgetRouter } from './routes/budget.routes.js';
import { dashboardRouter } from './routes/analytics.routes.js';


const urlPrefix = '/api/v1'

app.use(`${urlPrefix}/users`, userRouter);
app.use(`${urlPrefix}/transactions`, transactionRouter)
app.use(`${urlPrefix}/budget`, budgetRouter)
app.use(`${urlPrefix}/analytics-dashboard`, dashboardRouter);