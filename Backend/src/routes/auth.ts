import express, { Router } from 'express';
import { userSignup, userLogin } from '../controllers/auth';

const router = Router();

router.post('/api/v1/signup', userSignup);
router.post('/api/v1/login', userLogin);

export default router;