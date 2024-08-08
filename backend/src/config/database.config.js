import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { sample_user } from "../data.js";
import bcrypt from 'bcrypt';

const PASSWORD_HASH_SALT_ROUNDS = 10;

set('strictQuery', true);

export const dbconnect = async () => {
    try {
        await connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await seedUsers();

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