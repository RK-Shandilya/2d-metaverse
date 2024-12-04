import { Request, Response } from "express"
import Avatar from "../models/Avatar";
export const getAllAvatars = async(req : Request, res : Response) => {
    try {
        const avatars = await Avatar.find({});
        if(!avatars) {
            return res.status(404).json({ message: "No avatars found" });
        }
        res.status(200).json({
            success: true,
            avatars,
            message: "Avatars retrieved successfully"
        })
    } catch (error) {
        console.error("Error whie fetching all avatars",error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createAvatar = async(req: Request, res: Response) =>{
    try {
        const {name, imageUrl} = req.body;
        if(!name || !imageUrl) {
            return res.status(400).json({ message: "Name and Image URL are required" });
        }
        const newAvatar = Avatar.create({name, imageUrl});
        if(!newAvatar) {
            return res.status(400).json({ message: "Avatar not created" });
        }
        res.status(201).json({
            success: true,
            message: "Avatar created successfully"
        })

    } catch (error) {
        console.error("Error while creating avatar", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteAvatar = async( req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if(!id) {
            return res.status(400).json({ message: "Avatar ID is required" });
        }
        await Avatar.findByIdAndDelete({id});
        res.status(200).json({
            success: true,
            message: "Avatar deleted successfully"
        })
    } catch (error) {
        console.error("Error while deleting Avatar", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}