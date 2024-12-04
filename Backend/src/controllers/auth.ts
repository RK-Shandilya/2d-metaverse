import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from '../models/User';
import otpGenerator from 'otp-generator';
import z from 'zod';
import Otp from '../models/Otp';
import dotenv from 'dotenv';
dotenv.config();

const signupDetails = z.object({
    userName : z.string().min(3, "Username must be at least 3 characters long"),
    email : z.string().email("Invalid email format"),
    password : z.string().min(8, "Password must be at least 8 characters long"),
    otp: z.string()
})

interface UserPayload {
    id: string,
    email: string,
    role: string
}

export const userSignup = async (req: Request, res: Response):Promise<void> => {
    try {
        const { userName, email, password, otp} = signupDetails.parse(req.body);
        if(!userName || !email || !password || !otp) {
            res.status(400).json({message : "All fields are required"});
            return;
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(409).json({message: "User already Exists, Please Signup to proceed"});
            return;
        }
        const response = await Otp.find({email}).sort({createdAt :-1}).limit(1);
        if(response.length == 0){
            res.status(400).json({
                success: false,
                message: "OTP not found",
            })
            return;
        } else if(otp != response[0].otp){
            res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        })

        res.status(201).json({message : "User Signed Up Successfully"});

    } catch (error) {
        console.error("Error during Signup", error);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const userLogin = async (req: Request, res: Response): Promise<void> => {
    try {

        const { email, password } = req.body;
        if(!email || !password) {
            res.status(400).json({message : "All fields are required"});
            return;
        }

        const user = await User.findOne({email});
        if(!user) {
            res.status(401).json({message : "Invalid Credentials"});
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            res.status(401).json({message : "Password is incorrect, Please try again"});
            return;
        }

        const token = jwt.sign({email,id: user._id, role: user.role},process.env.JWT_SECRET as string,{
            expiresIn: '24h'
        });

        req.user = user as UserPayload;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            message: `User Login Success`,
        })

    } catch (error) {
        console.error("Error during Login", error);
        res.status(500).json({message : "Internal Server Error"}); 
    }
}

export const SendOtp = async(req: Request, res: Response): Promise<void> => {
    try{
        const { email } = req.body;
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            })
            return;
        }
        var otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false, 
        })

        const result = await Otp.findOne({otp});
        while(result){
            otp = otpGenerator.generate(6, {
                digits: true,
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false, 
            })
        }

        const otpPayload = { email, otp};
        const otpBody = await Otp.create(otpPayload);
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        })

    } catch (error) {
        console.error("Error during SendOtp", error);
        res.status(500).json({message : "Internal Server Error"});
    }
}