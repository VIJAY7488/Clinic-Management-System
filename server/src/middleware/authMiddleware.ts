import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../utils/logger";

interface RequestWithStaff extends Request {
    staff?: string | JwtPayload;
  }

export const authenticate = (
  req: RequestWithStaff,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    logger.error("No token, authorization denied");
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.staff = decoded; 
    next();
  } catch (error) {
    logger.error("Token is not valid", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
