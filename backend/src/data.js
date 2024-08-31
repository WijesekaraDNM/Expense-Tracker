export const sample_user = [
    {
        //userId: 1,
        userName: 'masha',
        email: 'masha@gmail.com',
        password: 'mash123',
        customIncomeCategories: [], 
        customExpenseCategories: []
    },
    {
        //userId: 2,
        userName: 'user',
        email: 'user@gmail.com',
        password: 'user123',
        customIncomeCategories: [], 
        customExpenseCategories: []
    },
];

export const sample_transactions = [
    {
        transactionId:1,
        user: '001',
        name: 'Salary',
        type: 'Income',
        category: 'Salary',
        date: '09/08/2024',
        note: 'from Office',
        amount: 50000.00,
    },
    {
        transactionId:2,
        user:'002',
        name: 'Grocery',
        type: 'Expense',
        category: 'Groceries',
        date: '10/08/2024',
        note: 'From Keels',
        amount: 6000.00,
    },
]