import express from 'express';
import { config } from 'dotenv';
import logger from './utils/logger';
import connectDB from './config/dbConnection';
import configureCors from './config/corsConfig';
import cookieParser from 'cookie-parser';


const app = express();
// Load environment variables
config();
const PORT = process.env.PORT || 3001;



// Middleware
app.use(configureCors());
app.use(express.json());
app.use(cookieParser());

// Routes



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

