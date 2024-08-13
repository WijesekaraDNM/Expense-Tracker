import { model, Schema } from "mongoose";

export const TransactionSchema = new Schema(
    {
        
        transactionId : {type: String, required: true},
        type: {
            type: String,
            enum: ['Income', 'Expense'],
            required: true,
        },
        name : {type: String, required: true},
        date : {type:String, required:true},
        amount : {type: Number, required:true},
        category : {
            type: String, 
            required:true,
            validate: {
            validator: function (value) {
                // Define your categories for income and expense
                const incomeCategories = ['Salary', 'Investment', 'Gift'];
                const expenseCategories = ['Rent', 'Groceries', 'Utilities'];
                
                // Check if the category is valid for the given type
                if (this.type === 'Income') {
                return incomeCategories.includes(value);
                } else if (this.type === 'Expense') {
                return expenseCategories.includes(value);
                }
                return false;
            },
            //message: props => `${props.value} is not a valid category for ${this.type}!`
    }
        },
        note : {type:String, default: "None"}
    },

    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

export const TransactionModel = model('transactions', TransactionSchema);