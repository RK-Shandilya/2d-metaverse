import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string,
    email: string,
    role: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.split(" ")[1] || req.cookies.token || req.body.token;
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as UserPayload;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.user?.role === 'admin') {
            next();
        }
        else {
            return res.status(403).json({ error: 'Access denied. You are not an admin'});
        }
    } catch(error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}