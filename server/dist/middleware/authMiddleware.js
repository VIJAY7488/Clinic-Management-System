"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        logger_1.default.error("No token, authorization denied");
        return res.status(401).json({
            success: false,
            message: "No token provided, authorization denied",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.staff = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error("Token is not valid", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
