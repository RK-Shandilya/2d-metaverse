import { Request, Response } from "express";

export const createMap = ( req: Request, res : Response ) => {
    try {
        const {name , thumbnail, dimensions, defaultElements} = req.body;
        if( !name || !thumbnail || !dimensions || !defaultElements ){
            return res.status(400).json({message: 'Missing required fields'})
        }
        const dimension = dimensions.split("x");
        const width = dimension[0];
        const height = dimensions[1];
    } catch ( error ) {
        console.error("Error while creating map", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}