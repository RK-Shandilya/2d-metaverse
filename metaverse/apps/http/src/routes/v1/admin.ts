import { Router } from "express";
import { createAvatar, createElement, createMap, updateElement } from "../../controllers/adminController";
import { adminMiddleware } from "../../middleware/admin";

export const adminRouter = Router();
adminRouter.use(adminMiddleware)

adminRouter.post('/element', createElement)

adminRouter.put('/element/:elementId', updateElement)

adminRouter.post('/avatar', createAvatar)

adminRouter.post('/map', createMap)

