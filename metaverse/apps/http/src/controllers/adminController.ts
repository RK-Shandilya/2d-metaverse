import { Request, Response } from "express";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../types";
import client from "@repo/db/client"

export const createElement = async (req: Request , res : Response) => {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
           message: "Validation failed",
           success: false
        });
        return;
    }
    try {
        const element = await client.element.create({
            data: {
                width: parsedData.data.width,
                height: parsedData.data.height,
                imageUrl: parsedData.data.imageUrl,
                static: parsedData.data.static
            }
        })

        res.status(200).json({
            success: true,
            message: "Element Created Successfully",
            id:element.id
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const createAvatar = async (req: Request , res : Response) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
           message: "Validation failed",
           success: false
        });
        return
    }
    try {
        const avatar = await client.avatar.create({
            data: {
                imageUrl: parsedData.data.imageUrl,
                name: parsedData.data.name
            }
        })

        res.status(200).json({
            success: true,
            message: "Avatar Created Successfully",
            avatarId: avatar.id
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const updateElement = async (req: Request , res : Response) => {
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
           message: "Validation failed",
           success: false
        });
        return
    }
    try {
        await client.element.update({
            where: {
                id: req.params.elementId
            },
            data: {
                imageUrl: parsedData.data.imageUrl
            }
        })

        res.status(200).json({
            success: true,
            message: "Element Updated Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const createMap = async (req: Request , res : Response) => {
    const parsedData = CreateMapSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            success: false,
            message: "Validation failed"
        })
        return;
    }
    try {
        const map = await client.map.create({
            data: {
                name: parsedData.data.thumbnail,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                thumbnail: parsedData.data.thumbnail,
                mapElements: {
                    create: parsedData.data.defaultElements.map((m)=>({
                        elementId: m.elementId,
                        x: m.x,
                        y: m.y
                    }))
                }
            }
        })
        res.status(200).json({
            success:true,
            message: "Map Created Successfully",
            id: map.id
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}