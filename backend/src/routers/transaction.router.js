import { Router } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { TransactionModel } from '../models/transactions.model.js';
import { CATEGORIES } from '../config/categories.js';


const router = Router();

router.post('/addTransaction', handler(async (req, res) => {

    const {name, type, date, category, amount, note} = req.body;
        // Validate required fields
    if ( !name || !type || !date || !category || !amount ) {
        return res.status(BAD_REQUEST).send("Missing required fields");
    }
    const newID = await generateTransactionID(type); 
    
    const newTransaction = {
        transactionId: newID,
        name,
        type,
        date,
        category,
        amount,
        note
    };

    try{
        const result = await TransactionModel.create(newTransaction);
        res.send(result);
    } catch(error){
        console.error("Error creating transaction:", error);
        res.status(BAD_REQUEST).send("transaction create error");
    }

}));

router.patch('/updateTransaction/:transactionId', handler(async (req, res) => {
    const { transactionId } = req.params;
    const {name, type, date, category, amount, note} = req.body;
        // Validate required fields
        if ( !name || !type || !date || !category || !amount) {
            return res.status(BAD_REQUEST).send("Missing required fields");
          }    
    try{
        let updateData = {name, type, date, category, amount, note};

        const updatedTransaction = await TransactionModel.findOneAndUpdate(
            { transactionId: transactionId },
            updateData,
            { new: true }
        );

        res.send(updatedTransaction);
    } catch(error){
        console.error("Error updating contacts:", error);
        res.status(BAD_REQUEST).send("Transaction update failed");
    }

}));

router.post('/getAll', handler( async(req,res) => {
    try{
        const result = await TransactionModel.find({});
        res.send(result);
    } catch(error){
        res.status(BAD_REQUEST).send("Transactions fetch error");
    }
}));

router.get('/categories', handler( async(req,res) => {
    res.json(CATEGORIES);
    
}));

router.delete('/deleteTransaction/:transactionId',handler(async(req,res) => {
    const { transactionId } = req.params;
    try{
        const deleteTransactionItem = await TransactionModel.deleteOne({transactionId:transactionId});
        console.log ("deleted transaction")
        res.send(deleteTransactionItem);

    } catch(error){
        res.status(BAD_REQUEST).send("Transaction delete error");
    }
}));

const generateTransactionID = async (type) =>{

    const idString = type.substring(0,1);
    const regexPattern = new RegExp("^" + idString);

    try{
        var countTransactions = await TransactionModel.countDocuments({transactionId: regexPattern});
        var id = idString + countTransactions.toString().padStart(3, '0');

        while(await TransactionModel.findOne({transactionId:id})){
            countTransactions++;
            id = idString + countTransactions.toString().padStart(3, '0');
        }

        return id;

    }catch(error){
        console.log("transaction id generate failed!");
    }
}

export default router;
