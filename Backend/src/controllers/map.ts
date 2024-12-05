import { Request, Response } from "express";
import mapModel from "../models/Map";

export const createMap = ( req: Request, res : Response ) => {
    try {
        const {name , thumbnail, dimensions, defaultElements} = req.body;
        if( !name || !thumbnail || !dimensions || !defaultElements ){
            return res.status(400).json({message: 'Missing required fields'})
        }
        const dimension = dimensions.split("x");
        const width = dimension[0];
        const height = dimensions[1];
        const map = mapModel.create({
            name,
            thumbnail,
            width,
            height,
            defaultElements
        })
        return res.status(201).json({message: 'Map created successfully', map})
    } catch ( error ) {
        console.error("Error while creating map", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}