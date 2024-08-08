dotenv.config();
import express from "express";
import cors from 'cors';
import userRouter from './routers/users.router.js';
import expenseRouter from './routers/expense.router.js';
import incomeRouter from './routers/expense.router.js'
import {dbconnect} from './config/database.config.js';
import multer from 'multer';

dbconnect();

const app = express();

app.use(express.json());

app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173'],
    })
);

app.use('/api/users',userRouter);


const PORT = 5000;
app.listen(PORT, () =>{
    console.log('listening on port '+ PORT);
})