import express from 'express';
import { loginStaff } from '../controller/authController';


const router = express.Router();


// Route to register a new user
router.post('/login', loginStaff);


// Export the router
export default router;