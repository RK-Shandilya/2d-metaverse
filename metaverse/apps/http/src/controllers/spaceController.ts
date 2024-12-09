import { Request, Response } from "express";
import { CreateSpaceSchema } from "../types";
import client from "@repo/db/client"

export const addSpaceElement = async(req: Request, res: Response) => {

}

export const createSpace = async(req: Request, res: Response) => {
    const payload = CreateSpaceSchema.safeParse(req.body);
    if (!payload.success) {
        res.status(400).json({
            success: false,
            message: "Invalid request" 
        });
        return;
    }

    try {
        if(!payload.data.mapId) {
            const space = await client.space.create({
                data : {
                    name: payload.data.name,
                    width: parseInt(payload.data.dimensions.split('x')[0]),
                    height: parseInt(payload.data.dimensions.split('x')[1]),
                    creatorId: req.userId 
                }
            })
            res.status(200).json({
                success: true,
                message: "Space created successfully",
                spaceId: space.id
            })
            return;
        }

        const map = await client.map.findUnique({
            where: {
                id: payload.data.mapId
            },
            select: {
                width: true,
                height: true,
                mapElements: true
            }
        })

        if(!map) {
            res.status(403).json({
                success: false,
                message: "Map not found"
            });
            return
        }

        let space = await client.$transaction( async()=>{

            const space = await client.space.create({
                data: {
                    name: payload.data.name,
                    width: map.width,
                    height: map.height,
                    creatorId: req.userId
                }
            })

            await client.spaceElements.createMany({
                data: map.mapElements.map((e)=>({
                    spaceId: space.id,
                    x: e.x as number,
                    y: e.y as number,
                    elementId: e.id
                }))
            })
            return space;
        })
        res.status(200).json({
            success: true,
            message: "Space created successfully",
            spaceId: space.id
        })
        
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Failed to create space"
        })
    }
}

export const deleteElement = async(req: Request, res: Response) => {

}

export const deleteSpace = async(req: Request, res: Response) => {
    try {
        const space = await client.space.findUnique({
            where: {
                id : req.params.spaceId
            }, select: {
                creatorId: true
            }
        })
    
        if(!space) {
            res.status(400).json({
                success:false,
                message: "Space not found"
            })
            return;
        }
    
        if(space?.creatorId !== req.userId) {
            res.status(403).json({
                success:false,
                message: "Unauthorized Access, Space is not created by you"
            })
            return;
        }
    
        await client.space.delete({
            where: {
                id: req.params.spaceId
            }
        })
    
        res.status(200).json({
            success:true,
            message: "Space deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete space"
        })
    }
}

export const getAllSpaces = async(req: Request, res: Response) => {

}

export const getSpecificSpace = async(req: Request, res: Response) => {

}