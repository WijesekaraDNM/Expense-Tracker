import e, { Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from "express-async-handler";
import { TransactionModel } from "../models/transactions.model.js";
import { UserModel } from "../models/user.model.js";
import { CATEGORIES } from "../config/categories.js";

const router = Router();

router.post(
  "/totals/:userId",
  handler(async (req, res) => {
    const { userId } = req.params;
    const { startingDate, endingDate} = req.body;
    console.log('router Dates:',startingDate);
    console.log('router Dates:',endingDate);
    try {
      const totals = await calculateTotalIncomeAndExpense(userId, startingDate,endingDate);
      res.json(totals);
    } catch (error) {
      console.error("Error calculating income and expense:", error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ error: "Error calculating income and expense" });
    }
  })
);

router.post(
  "/categorical-amounts/:userId",
  handler(async (req, res) => {
    const { userId } = req.params;
    const { startingDate, endingDate } = req.body;
    try {
      const totals = await calculateCategoryWiseAmounts(userId, startingDate, endingDate);
      res.json(totals);
    } catch (error) {
      console.error("Error calculating income and expense:", error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ error: "Error calculating income and expense" });
    }
  })
);

router.get(
  "/totals/daily/:userId",
  handler(async (req, res) => {
    const { userId } = req.params;
    try {
      const daily = await calculateTimeBasedTotals(userId, "day");
      const monthly = await calculateTimeBasedTotals(userId, "month");
      const annually = await calculateTimeBasedTotals(userId, "year");
      console.log("Daily Amounts:", daily.title);
      console.log("Monthly Amounts:", monthly);
      console.log("Annually Amounts:", annually);
      res.json({
        daily:daily, 
        monthly:monthly, 
        annually:annually
        }
     );
    } catch (error) {
      console.error("Error calculating daily totals:", error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ error: "Error calculating daily totals" });
    }
  })
);

export const calculateTotalIncomeAndExpense = async (userId, startingDate, endingDate) => {

  let dateFilter = {};

  if (startingDate) {
    dateFilter.$gte = startingDate;
  }
  if (endingDate) {
    dateFilter.$lte = endingDate;
  }

  // Fetch transactions with or without date filtering
  const transactions = await TransactionModel.find({
    user: userId,
    ...(startingDate || endingDate ? { date: dateFilter } : {})
  });

  let totalIncome = 0;
  let totalExpense = 0;
  let numberOfTransactions = transactions.length;
  let numberOfIncome = 0;
  let numberOfExpense = 0;

  transactions.forEach(transaction => {
    if (transaction.type === "Income") {
      totalIncome += transaction.amount;
      numberOfIncome++;
    } else if (transaction.type === "Expense") {
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
};

export const calculateCategoryWiseAmounts = async( userId, startingDate, endingDate )=> {

  let dateFilter = {};

  if (startingDate) {
    dateFilter.$gte = startingDate;
  }
  if (endingDate) {
    dateFilter.$lte = endingDate;
  }

  const transactions = await TransactionModel.find({ 
    user: userId,
    ...(startingDate || endingDate ? { date: dateFilter } : {}) 
  });
  const currentUser = await UserModel.findOne({ userId: userId });

  const incomeCategories = [
    ...CATEGORIES.income,
    ...currentUser.customIncomeCategories
  ];
  const expenseCategories = [
    ...CATEGORIES.expense,
    ...currentUser.customExpenseCategories
  ];

  // if (Array.isArray(currentUser.customIncomeCategories)) {
  //     incomeCategories.push(...currentUser.customIncomeCategories);
  // }

  // if (Array.isArray(currentUser.customExpenseCategories)) {
  //     expenseCategories.push(...currentUser.customExpenseCategories);
  // }

  const categoryWiseIncome = incomeCategories.map(category => ({
    category,
    amount: 0
  }));

  const categoryWiseExpense = expenseCategories.map(category => ({
    category,
    amount: 0
  }));

  // Iterate over transactions to calculate totals
  transactions.forEach(transaction => {
    const { type, amount, category } = transaction;

    if (type === "Income") {
      const incomeCategory = categoryWiseIncome.find(
        item => item.category === category
      );
      if (incomeCategory) incomeCategory.amount += amount;
    } else if (type === "Expense") {
      const expenseCategory = categoryWiseExpense.find(
        item => item.category === category
      );
      if (expenseCategory) expenseCategory.amount += amount;
    }
  });

  return {
    income: categoryWiseIncome,
    expense: categoryWiseExpense
  };
};

export const calculateTimeBasedTotals = async (userId, timeFrame) => {
  
  const dateFormat = timeFrame === 'day' ? '%Y-%m-%d' :(timeFrame === 'month'? '%b' : '%Y');
  const titleFormat = timeFrame === 'day' ? 'Daily Transaction Forecast' :(timeFrame === 'month'? 'Monthly Transaction Forecast' : 'Annual Transaction Forecast');
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
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] }
        }
      }
    },
    {
      $addFields: {
        netIncome: { $subtract: ["$totalIncome", "$totalExpense"] },
      }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: { format: dateFormat, date: "$_id." + timeFrame }
        },
        totalIncome: 1,
        totalExpense: 1,
        title:titleFormat,
        netIncome: 1
      }
    },
    { $sort: { date: 1 } }
  ];

  try {
    const results = await TransactionModel.aggregate(pipeline);
    //console.log("Aggregation Results:", results);
    return results;
  } catch (error) {
    console.error("Error calculating time-based totals:", error);
    throw error;
  }
};

export default router;
