import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { getAllAvatar, getAllElement, signin, signup } from "../../controllers/userController";

const router = Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/elements', getAllElement)
router.get('/avatars', getAllAvatar)
router.use('/user',userRouter);
router.use('/admin',adminRouter);
router.use('/space',spaceRouter);

export default router;