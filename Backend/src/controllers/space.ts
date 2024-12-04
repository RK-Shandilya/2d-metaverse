import { Request, Response } from "express";
import Space from "../models/Space";

export const createSpace = (req: Request, res : Response) => {
    try {
        const {} = req.body;
    } catch( error ) {
        console.error("Error while creating space",error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export const getUserAllSpaces = async(req: Request, res : Response) => {
    try {
        const user = req.user;
        const spaces = await Space.find({ user: user?.id });
        if(!spaces) {
            return res.status(404).send({ message: "No spaces found" });
        }
        res.status(200).json({
            spaces,
            success:true,
            message: "Spaces Fetched Successfully"
        })
    } catch ( error ) {
        console.error("Error while getting users all spaces",error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}