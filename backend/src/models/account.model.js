import { model, Schema } from "mongoose";
export const AccountSchema = new Schema(
    {
        account_id: { type: String, required: true },
        account_name: { type: String, required: true },
        balance: { type: Number, required: true },
        type: { type: String, required: true },
        iban: { type: String, required: true },
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

export const AccountModel = model('account', AccountSchema);