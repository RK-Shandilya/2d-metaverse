import { Request, Response } from "express";
import { AddElementSchema, CreateSpaceSchema, deleteElementSchema } from "../types";
import client from "@repo/db/client";

export const addSpaceElement = async(req: Request, res: Response) => {
    const parsedData = AddElementSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            message: "Invalid request body",
            success:false
        })
        return;
    }
    try {
    const space = await client.space.findUnique({
        where: {
            id: parsedData.data?.spaceId,
            creatorId: req.userId
        }, select: {
            width: true,
            height: true,
        }
    })

    if(!space) {
        res.status(400).json({
            message: "Space not Found",
            success:false
        })
        return;
    }

    if (
        parsedData.data.x < 0 ||
        parsedData.data.x > space.width ||
        parsedData.data.y < 0 ||
        parsedData.data.y > space.height
      ) {
        res.status(400).json({ message: "Invalid coordinates" });
        return;
      }

    await client.spaceElements.create({
        data: {
            elementId : parsedData.data.elementId,
            spaceId: parsedData.data.spaceId,
            x: parsedData.data.x,
            y: parsedData.data.y
        }
    })

    res.status(200).json({
        success: true,
        message: "Element Added to the space"
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
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
            res.status(201).json({
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
        let space = await client.$transaction( async ()=>{

            const space = await client.space.create({
                data: {
                    name: payload.data.name,
                    width: map.width,
                    height: map.height,
                    creatorId: req.userId
                }
            })

            await client.spaceElements.createMany({
                data: map.mapElements.map((e: any)=>({
                    spaceId: space.id,
                    x: e.x,
                    y: e.y,
                    elementId: e.elementId
                }))
            })

            return space;
        })

        res.status(201).json({
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
    const parsedData = deleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ 
            success: false,
            message: "Validation failed" 
        })
        return;
    }

    try {
        const spaceElement = await client.spaceElements.findFirst({
            where: {
                id: parsedData.data.id
            },
            include: {
                space: true
            }
        })
    
        
        if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
            res.status(403).json({ 
                success: false,
                message: "Unauthorized" 
            })
            return
        }
    
        
        await client.spaceElements.delete({
            where: {
                id: parsedData.data.id
            }
        })
    
        res.json({ 
            success: false,
            message: "Element deleted" 
        })
    } catch( error ){
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
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

        await client.$transaction(async()=>{
            await client.spaceElements.deleteMany({
                where:{
                    spaceId: req.params.spaceId
                }
            })

            await client.space.delete({
                where:{
                    id: req.params.spaceId
                }
            })
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
    try {
        const spaces = await client.space.findMany({
            where: {
                creatorId: req.userId
            }
        })
    
        res.status(200).json({
            spaces: spaces.map((s: any) => ({
                id: s.id,
                name: s.name,
                thumbnail: s.thumbnail,
                dimensions: `${s.width}x${s.height}`,
            }))
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get spaces"
        })
    }
}

export const getSpecificSpace = async(req: Request, res: Response) => {
    try {
        const space = await client.space.findUnique({
            where: {
                id: req.params.spaceId
            },
            include: {
                elements: {
                    include: { element: true }
                }
            }
        })
    
        if (!space) {
            res.status(400).json({ 
                success: false,
                message: "Space not found" 
            })
            return
        }
    
        res.json({
            dimensions: `${space.width}x${space.height}`,
            elements: space.elements.map((e: any) => ({
                id: e.id,
                element: {
                    id: e.element.id,
                    imageUrl: e.element.imageUrl,
                    width: e.element.width,
                    height: e.element.height,
                    static: e.element.static
                },
                x: e.x,
                y: e.y
            }))
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}