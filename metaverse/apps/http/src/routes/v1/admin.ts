import { Router } from "express";
import { createAvatar, createElement, createMap, updateElement } from "../../controllers/adminController";

export const adminRouter = Router();

adminRouter.post('/element', createElement)

adminRouter.post('/element/:elementId', updateElement)

adminRouter.get('/avatar', createAvatar)

adminRouter.get('/map', createMap)

