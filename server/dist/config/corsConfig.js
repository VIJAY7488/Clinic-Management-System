"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const configureCors = () => {
    const allowOrigins = ["https://clinic-management-system-kj8f.vercel.app"];
    return (0, cors_1.default)({
        origin(origin, callback) {
            if (!origin || allowOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("CORS: Origin not allowed"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
        credentials: true,
        maxAge: 10 * 60 * 60 * 1000, // 10min
    });
};
exports.default = configureCors;
