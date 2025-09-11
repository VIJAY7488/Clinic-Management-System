"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const logger_1 = __importDefault(require("./utils/logger"));
const dbConnection_1 = __importDefault(require("./config/dbConnection"));
const corsConfig_1 = __importDefault(require("./config/corsConfig"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const doctorRoutes_1 = __importDefault(require("./routes/doctorRoutes"));
const patientRoutes_1 = __importDefault(require("./routes/patientRoutes"));
const appointmentsRoutes_1 = __importDefault(require("./routes/appointmentsRoutes"));
const app = (0, express_1.default)();
// Load environment variables
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, corsConfig_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/doctors', doctorRoutes_1.default);
app.use('/api/patients', patientRoutes_1.default);
app.use('/api/appointments', appointmentsRoutes_1.default);
//Server Listening
(0, dbConnection_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        logger_1.default.info(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    logger_1.default.error("Failed to connect to DB", err);
});
