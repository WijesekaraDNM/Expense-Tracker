import { Router } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { TransactionModel } from '../models/transactions.model.js';
import { CATEGORIES } from '../config/categories.js';
import { UserModel } from '../models/user.model.js';


const router = Router();

router.post('/addTransaction', handler(async (req, res) => {

    const {name, type, date, category, amount, note, user} = req.body;
    
        // Validate required fields
    if ( !name || !type || !date || !category || !amount || !user ) {
        return res.status(BAD_REQUEST).send("Missing required fields");
    }
    const newID = await generateTransactionID(type); 
    
    const newTransaction = {
        transactionId: newID,
        user: user,
        name,
        type,
        date,
        category,
        amount,
        note
    };

    try{
        const result = await TransactionModel.create(newTransaction);
        const result1 = await addToCustomCategories(user, category, type);
        console.log("result1: ", result1);
        res.send(result);
    } catch(error){
        console.error("Error creating transaction:", error);
        res.status(BAD_REQUEST).send("transaction create error");
    }

}));

router.patch('/updateTransaction/:transactionId', handler(async (req, res) => {
    const { transactionId } = req.params;
    const {name, type, date, category, amount, note, user} = req.body;
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
        await addToCustomCategories(user, category, type);
        res.send(updatedTransaction);
    } catch(error){
        console.error("Error updating contacts:", error);
        res.status(BAD_REQUEST).send("Transaction update failed");
    }

}));

router.post('/getAll/:userId', handler( async(req,res) => {
    const { userId } = req.params;
    const { startingDate, endingDate } = req.body;
    console.log("UserId date:", startingDate);
    try{

        let dateFilter = {};

        if (startingDate) {
            dateFilter.$gte = startingDate;
        }
        if (endingDate) {
            dateFilter.$lte = endingDate;
        }

        const result = await TransactionModel.find({ 
            user: userId,
            ...(startingDate || endingDate ? { date: dateFilter } : {}) 
        });
        res.send(result);
    } catch(error){
        res.status(BAD_REQUEST).send("Transactions fetch error");
    }
}));

router.get('/categories/:userId', handler( async(req,res) => {
    const { userId } = req.params;
    console.log("founded UserID in cate:", userId);
    const currentUser = await UserModel.findOne({userId:userId});
    console.log("founded User in cate:", currentUser);
    const incomeCategories=[...CATEGORIES.income,...currentUser.customIncomeCategories];
    const expenseCategories=[...CATEGORIES.expense,...currentUser.customExpenseCategories];

    // if (Array.isArray(currentUser.customIncomeCategories)) {
    //     incomeCategories.push(...currentUser.customIncomeCategories);
    // }

    // if (Array.isArray(currentUser.customExpenseCategories)) {
    //     expenseCategories.push(...currentUser.customExpenseCategories);
    // }
    //res.json(categories);
    res.json({ income: incomeCategories, expense: expenseCategories });
    
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

const addToCustomCategories = async (userId, category, type) => {
    const user = await UserModel.findOne({userId:userId});
    // if (type === 'Income' && !user.customIncomeCategories.includes(category) && ![CATEGORIES.income].includes(category)) {
    //   user.customIncomeCategories.push(category);
    // } else if (type === 'Expense' && !user.customExpenseCategories.includes(category) && ![CATEGORIES.expense].includes(category)) {
    //   user.customExpenseCategories.push(category);
    // }
    // await user.save();
    console.log("categoru User:",  type);
    console.log("categoru:", category);
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    if (type === 'Income') {
        if (!user.customIncomeCategories) {
            user.customIncomeCategories = [];
        }
        if (!user.customIncomeCategories.includes(category) && !CATEGORIES.income.includes(category)) {
            user.customIncomeCategories.push(category);
        }
    } else if (type === 'Expense') {
        if (!user.customExpenseCategories) {
            user.customExpenseCategories = [];
        }
        if (!user.customExpenseCategories.includes(category) && !CATEGORIES.expense.includes(category)) {
            user.customExpenseCategories.push(category);
        }
    }
    await user.save();
  };

export default router;
