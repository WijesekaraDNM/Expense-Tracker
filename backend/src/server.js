import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from 'cors';
import calculationsRouter from './routers/calculations.router.js';
import userRouter from './routers/users.router.js';
import transactionsRouter from './routers/transaction.router.js'
import {dbconnect} from './config/database.config.js';

dbconnect();

const app = express();

app.use(express.json());

app.use(cors({
    credentials:true,
    origin: ['http://localhost:5174', 'http://localhost:3000'],
    })
);

app.use('/api/users',userRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/calculations', calculationsRouter);
// app.use('/api/expense', expenseRoutere);
// app.use('/api/income', incomeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log('listening on port '+ PORT);
})