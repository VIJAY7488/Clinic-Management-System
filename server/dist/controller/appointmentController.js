"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatus = exports.deleteAppointment = exports.updateAppointment = exports.createAppointment = exports.getAppointmentById = exports.getAppointments = void 0;
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const tryCatchWrapper_1 = __importDefault(require("../utils/tryCatchWrapper"));
const logger_1 = __importDefault(require("../utils/logger"));
// Get all appointments
exports.getAppointments = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Fetching all appointments");
    const appointments = await appointmentModel_1.default.find().populate("doctor");
    res.status(200).json({ success: true, appointments });
});
// Get appointment by ID
exports.getAppointmentById = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info(`Fetching appointment ${req.params.id}`);
    const appointment = await appointmentModel_1.default.findById(req.params.id).populate("doctor");
    if (!appointment) {
        logger_1.default.warn(`Appointment not found with id ${req.params.id}`);
        return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ success: true, appointment });
});
// create new appointment
exports.createAppointment = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Creating new appointment", { body: req.body });
    const appointment = new appointmentModel_1.default(req.body);
    const savedAppointment = await appointment.save();
    res.status(201).json({ success: true, savedAppointment });
});
// update appointment
exports.updateAppointment = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info(`Updating appointment ${req.params.id}`, { body: req.body });
    const updatedAppointment = await appointmentModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate("doctor");
    if (!updatedAppointment) {
        logger_1.default.warn(`Appointment not found with id ${req.params.id}`);
        return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(updatedAppointment);
});
//    Delete appointment
exports.deleteAppointment = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info(`Deleting appointment ${req.params.id}`);
    const deletedAppointment = await appointmentModel_1.default.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
        logger_1.default.warn(`Appointment not found with id ${req.params.id}`);
        return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
});
// Update appointment status
exports.updateAppointmentStatus = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("status api end point hit");
    const { status } = req.body;
    logger_1.default.info(`Updating status for appointment ${req.params.id}`, { status });
    const appointment = await appointmentModel_1.default.findById(req.params.id);
    if (!appointment) {
        logger_1.default.warn(`Appointment not found with id ${req.params.id}`);
        return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = status || appointment.status;
    const updated = await appointment.save();
    res.status(200).json(updated);
});
