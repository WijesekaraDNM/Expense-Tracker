import { model, Schema } from "mongoose";
export const UserSchema = new Schema(
    {
        
        userId : {type: String, required: true},
        userName : {type: String, required: true},
        email : {type:String, required:true},
        password : {type: String, required:true},
        // preferredSequence: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
        resetPasswordToken: { type: String }, // Field for the password reset token
        resetPasswordExpires: { type: Date },
        transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }], 
        customIncomeCategories: { type: [String], default:[] }, // Custom income categories
        customExpenseCategories: { type: [String], default:[] }
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

export const UserModel = model('users', UserSchema);