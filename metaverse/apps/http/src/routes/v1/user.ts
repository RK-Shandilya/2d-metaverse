import { Router  } from "express";
import {updateUserMetadata , getDiffUserMetadata } from '../../controllers/userController'
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();

userRouter.post('/metadata', userMiddleware, updateUserMetadata)

userRouter.get('/metadata/bulk', getDiffUserMetadata);
