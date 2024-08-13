import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { TransactionModel } from "../models/transactions.model.js";
import { sample_user } from "../data.js";
import { sample_transactions } from "../data.js";
import bcrypt from 'bcrypt';

const PASSWORD_HASH_SALT_ROUNDS = 10;

set('strictQuery', true);

export const dbconnect = async () => {
    try {
        await connect(process.env.MONGO_URI);

        await seedUsers();
        await seedTransaction();
        console.log('Connected successfully!');

        // Watch for changes only after seeding is done
        //await watchUsers();
    } catch (error) {
        console.log(error);
    }
};

//real time users
async function watchUsers(){
    
    const changeStream = UserModel.watch();

    changeStream.on('change', async (change) => {
        console.log(change);

    const userList = await UserModel.find();
    console.log('Updated user list:', userList); 
    });

    await new Promise(()=>{});
}


async function seedUsers() {
    const usersCount = await UserModel.countDocuments();
    if(usersCount > 0 ) {
        console.log('User seed is already done!');
        return;
    }

    for(let user of sample_user) {
        user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
        await UserModel.create(user);
    }

    console.log('User seed is done!');
}

async function seedTransaction() {
    const transactionCount = await TransactionModel.countDocuments();
    if(transactionCount > 0 ) {
        console.log('Transaction seed is already done!');
        return;
    }

    for(let transaction of sample_transactions) {
        await TransactionModel.create(transaction);
    }

    console.log('Transaction seed is done!');
}



