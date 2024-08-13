import { Router } from "express";
import jwt from "jsonwebtoken";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';

const PASSWORD_HASH_SALT_ROUNDS = 10;
const router = Router()

router.post('/login', handler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password)) ) {
            res.send(generateTokenResponse(user));
        } else {
            res.status(BAD_REQUEST).send("User name or password is incorrect");
        }
    } catch (error) {
        res.status(BAD_REQUEST).send("Login failed!");
    }
}));

router.post(
    '/register',
    handler(async (req, res) => {
        const { userName, email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (user) {
            res.status(BAD_REQUEST).send('User name already taken, please enter another!');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            PASSWORD_HASH_SALT_ROUNDS
        );

        const newUser = {
            id: (await generateID()).toString(),
            userName,
            email,
            password: hashedPassword
        };

        const result = await UserModel.create(newUser);
        res.send(generateTokenResponse(result));
    })
);

router.post('/setAccess', handler(async (req, res) => {

    const { userName, email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
        res.status(BAD_REQUEST).send('User name already taken, please enter another!');
        return;
    }

    const hashedPassword = await bcrypt.hash(
        password,
        PASSWORD_HASH_SALT_ROUNDS
    );

    const newUser = {
        id: (await generateID()).toString(),
        userName,
        email,
        password: hashedPassword
    };

    const result = await UserModel.create(newUser);
    res.send(generateTokenResponse(result));
}));

router.post('/getAll', handler(async (req, res) => {

    try {
        const users = await UserModel.find({});
        res.send(users);
    } catch (error) {
        res.status(BAD_REQUEST).send("Users not found");
    }

}));

const generateTokenResponse = user => {
    const token = jwt.sign({
        id: user.id,
        userName: user.userName,
        email: user.email
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    );

    return {
        id: user.id,
        userName: user.userName,
        email: user.email,
        token,
    };
};

const generateID = async () => {
    var count = await UserModel.countDocuments();

    while (await UserModel.findOne({ id: count.toString() })) {
        count++;
    }

    return count;
};

export default router;                                                                                                                                                                                                                                                                                                                                 