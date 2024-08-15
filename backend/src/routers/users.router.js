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
            userId: (await generateID()).toString(),
            userName,
            email,
            password: hashedPassword
        };

        const result = await UserModel.create(newUser);
        res.send(generateTokenResponse(result));
    })
);

const generateTokenResponse = user => {
    const token = jwt.sign({
        userId: user.userId,
        userName: user.userName,
        email: user.email
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    );

    return {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        token,
    };
};

const generateID = async () => {
    var count = await UserModel.countDocuments();

    while (await UserModel.findOne({ userId: count.toString() })) {
        count++;
    }

    return count;
};

export default router;                                                                                                                                                                                                                                                                                                                                 