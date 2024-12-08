import { Router } from "express";
import { addSpaceElement, createSpace, deleteElement, deleteSpace, getAllSpaces, getSpecificSpace } from "../../controllers/spaceController";
export const spaceRouter = Router();

spaceRouter.post('/',createSpace);

spaceRouter.delete('/:spaceId',deleteSpace);

spaceRouter.get("/all", getAllSpaces);

spaceRouter.post ("/element", deleteElement);

spaceRouter.delete("/:elementId", addSpaceElement);

spaceRouter.get('/:spaceId', getSpecificSpace);