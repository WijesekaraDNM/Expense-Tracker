import { Router } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { TransactionModel } from '../models/transactions.model.js';
import { CATEGORIES } from '../config/categories.js';


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

router.post('/getAll/:userId', handler( async(req,res) => {
    const { userId } = req.params;
    console.log("UserId:", userId);
    try{
        const result = await TransactionModel.find({ user: userId });
        console.log("Result:", result);
        res.send(result);
    } catch(error){
        res.status(BAD_REQUEST).send("Transactions fetch error");
    }
}));

router.get('/categories', handler( async(req,res) => {
    res.json(CATEGORIES);
    
}));

router.get('/totals/:userId', handler(async (req, res) => {
    const { userId } = req.params;
    try {
        const totals = await calculateTotalIncomeAndExpense(userId);
        res.json(totals);
    } catch (error) {
        console.error('Error calculating income and expense:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error calculating income and expense' });
    }
}));

router.get('/categorical-amounts/:userId', handler(async (req, res) => {
    const { userId } = req.params;
    try {
        const totals = await calculateCategoryWiseAmounts(userId);
        res.json(totals);
    } catch (error) {
        console.error('Error calculating income and expense:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error calculating income and expense' });
    }
}));

router.get('/totals/daily/:userId', handler(async (req, res) => {
    const { userId } = req.params;
    try {
        const results = await calculateTimeBasedTotals(userId, 'day');
        console.log("Daily Amounts:", results);
        res.json(results);
    } catch (error) {
        console.error('Error calculating daily totals:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error calculating daily totals' });
    }
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

export const calculateTotalIncomeAndExpense = async (userId) => {
    const transactions = await TransactionModel.find({ user: userId });

    let totalIncome = 0;
    let totalExpense = 0;
    let numberOfTransactions = transactions.length;
    let numberOfIncome = 0;
    let numberOfExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
            numberOfIncome++;
        } else if (transaction.type === 'Expense') {
            totalExpense += transaction.amount;
            numberOfExpense++;
        }
    });

    const rest = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        rest,
        numberOfTransactions,
        numberOfExpense,
        numberOfIncome
    };
}


export const calculateCategoryWiseAmounts = async (userId) => {
    const transactions = await TransactionModel.find({ user: userId });

    const categoryWiseIncome = CATEGORIES.income.map(category => ({
        category,
        amount: 0
    }));

    const categoryWiseExpense = CATEGORIES.expense.map(category => ({
        category,
        amount: 0
    }));

    // Iterate over transactions to calculate totals
    transactions.forEach(transaction => {
        const { type, amount, category } = transaction;

        if (type === 'Income') {
            const incomeCategory = categoryWiseIncome.find(item => item.category === category);
            if (incomeCategory) incomeCategory.amount += amount;
        } else if (type === 'Expense') {
            const expenseCategory = categoryWiseExpense.find(item => item.category === category);
            if (expenseCategory) expenseCategory.amount += amount;
        }
    });

    return {
        income: categoryWiseIncome,
        expense: categoryWiseExpense
    };
};

export const calculateTimeBasedTotals = async (userId, timeFrame) => {
    const pipeline = [
        { $match: { user: userId } },
        {
            $addFields: {
                dateAsDate: { $dateFromString: { dateString: "$date" } }
            }
        },
        {
            $group: {
                _id: {
                    [timeFrame]: { $dateTrunc: { date: "$dateAsDate", unit: timeFrame } }
                },
                totalIncome: { $sum: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] } }
            }
        },
        {
            $project: {
                _id: 0,
                date: { $dateToString: { format: "%Y-%m-%d", date: "$_id." + timeFrame } },
                totalIncome: 1,
                totalExpense: 1
            }
        },
        { $sort: { date: 1 } }
    ];

    try {
        const results = await TransactionModel.aggregate(pipeline);
        console.log("Aggregation Results:", results);
        return results;
    } catch (error) {
        console.error('Error calculating time-based totals:', error);
        throw error;
    }
};


export default router;
