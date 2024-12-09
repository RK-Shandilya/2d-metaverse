import { Request, Response } from "express";
import { SigninSchema, SignupSchema, UpdateMetadataSchema } from "../types";
import bcrypt from "bcrypt";
import client from "@repo/db/client"
import jwt from 'jsonwebtoken'
import { JWT_PASSWORD } from "../config";


export const signup = async(req: Request, res: Response) => {
    const parsedData = SignupSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "All fields are required",
        })
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password,10);

        const isUserAlreadyExist = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        
        if(isUserAlreadyExist) {
            res.status(400).json({
                success: false,
                message: "User already exist"
            })
            return;
        }

        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.role === 'admin' ? 'Admin' : 'User'
            }
        })

        res.status(200).json({
            success: true,
            userId : user.id,
            message: "User created successfully",
        })

    } catch( error ) {
        res.status(500).json({
            success: false,
            message : "Internal Server Error"
        })
    }

}

export const signin = async(req: Request, res: Response) => {
    const parsedData = SigninSchema.safeParse(req.body);
    console.log(parsedData.error);
    if(!parsedData.success){
        res.status(403).json({
            message: "Invalid request body",
        })
        return;
    }
    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data?.username
            }
        })

        if(!user){
            res.status(403).json({
                success: false,
                message: "Please Signup to continue"
            })
            return;
        }

        const isValidPassword = await bcrypt.compare(parsedData.data?.password as string, user?.password);
        if(!isValidPassword){
            res.status(403).json({
                success: false,
                message: "Invalid password"
            })
            return;
        }

        const payload = {
            userId: user.id,
            role: user.role,
        }

        const token = jwt.sign(payload, JWT_PASSWORD);

        res.status(200).json({
            success: true,
            token,
            message: "Signin successful",
        })
         
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const updateUserMetadata = async(req: Request, res: Response) => {
    const payload = UpdateMetadataSchema.safeParse(req.body);
    console.log(payload.success);
    if(!payload.success){
        res.status(400).json({
            success: false,
            message: "Invalid request body"
        })
        return;
    }
    try {
        await client.user.update({
            where : {
                id : req.userId
            },
            data: {
                avatarId : payload.data?.avatarId
            }
        })

        res.status(200).json({
            success: true,
            message: "Metadata updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getDiffUserMetadata = async(req: Request, res: Response) => {
    const userIdAsArray = JSON.parse((req.query.ids ?? "[]") as string);
    
    try {
        const metadata = await client.user.findMany({
            where: {
                id: {
                    in : userIdAsArray
                }
            },
            select : {
                avatar : true,
                id: true
            }
        })

        res.status(200).json({
            success: true,
            data : {
                avatars : metadata.map((m)=>({
                    id: m.id,
                    avatarId : m.avatar?.imageUrl
                }))
            }        
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
