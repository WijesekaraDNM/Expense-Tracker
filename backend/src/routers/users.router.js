import { Router } from "express";
import jwt from "jsonwebtoken";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { OAuth2Client } from "google-auth-library";
import { AccountModel } from "../models/account.model.js";
import axios from 'axios';


dotenv.config();
const PASSWORD_HASH_SALT_ROUNDS = 10;
const router = Router()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const BOC_CLIENT_ID = process.env.BOC_CLIENT_ID;
const BOC_CLIENT_SECRET = process.env.BOC_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const BOC_BASE_URL = "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2"; 

console.log("Backend Google Client ID:", CLIENT_ID);
const client = new OAuth2Client(CLIENT_ID);

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Function to get the OAuth2 token
const getOAuthToken = async () => {
  try {
    const response = await axios.post(`${BOC_BASE_URL}/oauth2/token`, 
      `client_id=${BOC_CLIENT_ID}&client_secret=${BOC_CLIENT_SECRET}&grant_type=client_credentials`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error retrieving OAuth token:', error.message);
    throw new Error('Failed to retrieve OAuth token');
  }
};

// Endpoint to get account details
router.get('/boc/accounts', async (req, res) => {
  
  try {
    const token = await getOAuthToken();
    const response = await axios.get(`${BOC_BASE_URL}/v1/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.accounts || !Array.isArray(response.data.accounts)) {
      return res.status(500).send('Invalid API response structure');
    }

    const createdAccounts = [];
    for (const accountData of response.data.accounts) {
      const { accountId, account_name, balance, type, iban } = accountData;

      const existingAccount = await AccountModel.findOne({ account_id: accountId });
      if (existingAccount) {
        console.log(`Account with ID ${accountId} already exists.`);
        continue;
      }

      const newAccount = {
        account_id: accountId,
        account_name,
        balance,
        type,
        iban,
      };

      const result = await AccountModel.create(newAccount);
      createdAccounts.push(result);
    }

    res.status(200).json({ message: "Accounts fetched and saved successfully", createdAccounts });
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).send('Error fetching account details');
  }
});

// Google Login
router.post("/google-login", handler( async (req, res) => {
  const { token } = req.body;
  try {
   
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Check if user exists in the database
    let user = await UserModel.findOne({ email: payload.email });
    

    // If user doesn't exist, create a new one
    if (!user) {
      const newUser = {
        userId: (await generateID()).toString(),
        userName: payload.name,
        email: payload.email,
        password: crypto.randomBytes(16).toString("hex"), 
      };
      user = await UserModel.create(newUser);
    }

    res.send(generateTokenResponse(user));

  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid Google token" });
  }
})
);


router.post('/login', handler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password)) ) {
            res.send(generateTokenResponse(user));
        } else {
            res.status(BAD_REQUEST).send("Email or password is incorrect");
        }
    } catch (error) {
        res.status(BAD_REQUEST).send("Login failed!");
    }
}));

router.post('/register',handler(async (req, res) => {
        const { userName, email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (user) {
            res.status(BAD_REQUEST).send('Email already in use, please enter another!');
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

router.post('/forgot-password',handler( async (req, res) => {
    const { email } = req.body;
    console.log("Email reseived by router:",email);
    try {
      const user = await UserModel.findOne({ email });
      console.log("Founded user in router:",user);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      
      // Set token expiration time
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
      await user.save();
      
      // Send email with reset link
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log("transporter", transporter);
  
      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://localhost:3000/reset-password/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      const mail = await transporter.sendMail(mailOptions);
      console.log("mail: ", mail)
  
      res.status(200).json({ message: "Password reset link sent" });
    } catch (error) {
      res.status(500).json({ error: "Error sending email" });
    }
  })
);

router.post('/reset-password/:token',handler( async (req, res) => {
    try {
        const user = await UserModel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ error: "Password reset token is invalid or has expired." });
      }
      
      const hashedPassword = await bcrypt.hash(req.body.password, PASSWORD_HASH_SALT_ROUNDS);
      user.password = hashedPassword; // make sure to hash the password before saving
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
      res.status(200).json({ message: "Password has been reset." });
    } catch (error) {
      res.status(500).json({ error: "Error resetting password" });
    }
  })
);


export default router;                                                                                                                                                                                                                                                                                                                                 