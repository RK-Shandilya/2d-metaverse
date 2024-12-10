import { Router } from "express";
import { addSpaceElement, createSpace, deleteElement, deleteSpace, getAllSpaces, getSpecificSpace } from "../../controllers/spaceController";
import { userMiddleware } from "../../middleware/user";
export const spaceRouter = Router();

spaceRouter.post('/', userMiddleware, createSpace);

spaceRouter.delete('/:spaceId', userMiddleware, deleteSpace);

spaceRouter.get("/all", userMiddleware, getAllSpaces);

spaceRouter.post ("/element",userMiddleware, deleteElement);

spaceRouter.delete("/:elementId", userMiddleware, addSpaceElement);

spaceRouter.get('/:spaceId', getSpecificSpace);