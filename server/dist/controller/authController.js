"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginStaff = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const tryCatchWrapper_1 = __importDefault(require("../utils/tryCatchWrapper"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const staffSchema_1 = require("../utils/staffSchema");
exports.loginStaff = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info('Login endpoint hit');
    const { username, password } = req.body;
    const staff = await staffSchema_1.Staff.findOne({ username });
    if (!staff) {
        logger_1.default.error("Invalid username or password");
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // Check password
    const isPasswordValid = await bcryptjs_1.default.compare(password, staff.password);
    if (!isPasswordValid) {
        logger_1.default.error("Invalid password or username");
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: staff._id, role: "staff" }, process.env.JWT_SECRET, {
        expiresIn: "6h",
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 6 * 60 * 60 * 1000
    });
    logger_1.default.info('Login successful');
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
