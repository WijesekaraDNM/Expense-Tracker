import { model, Schema } from "mongoose";
export const UserSchema = new Schema(
    {
        
        userId : {type: String, required: true},
        userName : {type: String, required: true},
        email : {type:String, required:true},
        password : {type: String, required:true},
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