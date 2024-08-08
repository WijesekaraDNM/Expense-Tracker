import { model, Schema } from "mongoose";
export const ExpensesSchema = new Schema(
    {
        expenseId : {type:String, required:true},
        expenseName : {type: String, required: true},
        date : {type:String, required:true},
        amount : {type: String, required:true},
        category : {type: String, required:true},
        note : {type:String, required:true}
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

export const ExpensesModel = model('expenses', ExpensesSchema);