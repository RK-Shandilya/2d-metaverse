import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../config";
import jwt from "jsonwebtoken";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if(!token) {
        res.status(403).json({
            success:false,
            message: "Unauthorized Access"
        })
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as {role: string, userId : string};
        req.userId = decoded.userId;
        next();

    } catch (error){
        res.status(500).json({
            success:false,
            message: "Internal Server Error"
        })
    }
}