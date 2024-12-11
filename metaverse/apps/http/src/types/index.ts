import z from "zod";

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["admin","user"])
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters")
})

export const UpdateMetadataSchema = z.object({
    avatarId : z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    dimensions : z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId : z.string().optional()
})

export const deleteElementSchema = z.object({
    id: z.string(),
})

export const AddElementSchema = z.object({
    spaceId: z.string(),            
    elementId: z.string(), 
    x: z.number(),
    y: z.number(),
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),            
    static: z.boolean(), 
    width: z.number(),
    height: z.number(),
})

export const UpdateElementSchema = z.object({
    imageUrl : z.string()
})

export const CreateAvatarSchema = z.object({
    imageUrl : z.string(),
    name: z.string().min(3, "Name must be at least 3 characters")
})

export const CreateMapSchema = z.object({
    thumbnail : z.string(),
    dimensions : z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements : z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
})

declare global {
    namespace Express {
        interface Request {
            role : "Admin" | "User",
            userId : string
        }
    }
}