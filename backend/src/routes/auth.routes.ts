import express from 'express';
import { registerCompany, login } from '../controllers/auth.controller';

const router = express.Router();

// Public Routes
router.post('/register', registerCompany);
router.post('/login', login);

export default router;