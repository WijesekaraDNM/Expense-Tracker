import { model, Schema } from "mongoose";
export const IncomeSchema = new Schema(
    {
        
        incomeId : {type: String, required: true},
        incomeName : {type: String, required: true},
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

export const IncomeModel = model('incomes', IncomeSchema);