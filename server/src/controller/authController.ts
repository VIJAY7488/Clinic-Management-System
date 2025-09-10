import { Request, Response } from "express";
import logger from "../utils/logger";
import wrapAsyncFunction from "../utils/tryCatchWrapper";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Staff } from "../utils/staffSchema";



export const loginStaff = wrapAsyncFunction(async(req: Request, res: Response) => {
    logger.info('Login endpoint hit');

    
    
    const {username, password} = req.body;

    logger.info('Request Body', { body: req.body });

    const staff = await Staff.findOne({ username });
    logger.info('Staff fetched from DB ', { staff });
    logger.error("Invalid username or password");
    if (!staff) return res.status(401).json({ message: "Invalid credentials" });

    // Check password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      logger.error("Invalid password or username");
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = jwt.sign({ id: staff._id, role: "staff" }, process.env.JWT_SECRET as string, {
      expiresIn: "6h",
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 6 * 60 * 60 * 1000
    });

    logger.info('Login successful');

    res.status(200).json({
        success: true,
        message: 'Login successful',
        staff: {
            id: staff._id,
            username: staff.username,
            token: token
        },
    });
});
