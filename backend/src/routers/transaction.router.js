import { Router } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { TransactionModel } from '../models/transactions.model.js';
import { CATEGORIES } from '../config/categories.js';
import { UserModel } from '../models/user.model.js';
import axios from 'axios';

const router = Router();
const BOC_CLIENT_ID = process.env.BOC_CLIENT_ID;
const BOC_CLIENT_SECRET = process.env.BOC_CLIENT_SECRET;

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

// Function to get the OAuth2 token
const getOAuthToken = async () => {
    const response = await axios.post('https://api.boc.lk/oauth/token', {
      client_id: BOC_CLIENT_ID,
      client_secret: BOC_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return response.data.access_token;
};
// Endpoint to get account statement (transactions)
router.get('/boc/transactions/:account_id', async (req, res) => {
    const { accountId } = req.params;
  
    try {
      const token = await getOAuthToken();
      const response = await axios.get(`${BOC_BASE_URL}/v1/accounts/${accountId}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const {transaction_id, date, description, amount, type, account_id} = response.data.transactions;
       const newID = await generateTransactionID(type); 
    
        const newTransaction = {
            transactionId: newID,
            user: user,
            name: transaction_id,
            type,
            date,
            category,
            amount,
            note: description
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
  
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Error fetching transactions');
    }
  });

export default router;
