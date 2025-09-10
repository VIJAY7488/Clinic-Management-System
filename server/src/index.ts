import express from 'express';
import { config } from 'dotenv';
import logger from './utils/logger';
import connectDB from './config/dbConnection';
import configureCors from './config/corsConfig';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';


const app = express();
// Load environment variables
config();
const PORT = process.env.PORT || 3001;



// Middleware
app.use(configureCors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);



//Server Listening
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    logger.error("Failed to connect to DB", err);
});

import bcrypt from "bcryptjs";

const plainPassword = "password";  // the password you want
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds).then(hash => {
  console.log("Hashed password:", hash);
});

