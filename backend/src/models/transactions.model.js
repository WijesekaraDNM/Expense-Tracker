import { model, Schema } from "mongoose";

export const TransactionSchema = new Schema(
    {
        
        transactionId : {type: String, required: true},
        user: { type: String, ref: 'User', required: true},
        type: {
            type: String,
            enum: ['Income', 'Expense'],
            required: true,
        },
        name : {type: String, required: true},
        date : {type:String, required:true},
        amount : {type: Number, required:true},
        category : {type: String, required:true},
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