"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.updateDoctor = exports.getDoctorById = exports.getDoctors = exports.createDoctor = void 0;
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const logger_1 = __importDefault(require("../utils/logger"));
const tryCatchWrapper_1 = __importDefault(require("../utils/tryCatchWrapper"));
// Create doctor
exports.createDoctor = (0, tryCatchWrapper_1.default)(async (req, res) => {
    const doctor = await doctorModel_1.default.create(req.body);
    logger_1.default.info("Doctor created", { doctorId: doctor._id });
    res.status(201).json({
        success: true,
        message: "Doctor created successfully",
        data: doctor,
    });
});
// Get all doctors (optional filters: specialization, location, active status)
exports.getDoctors = (0, tryCatchWrapper_1.default)(async (req, res) => {
    const { specialization, location, isActive } = req.query;
    const filters = {};
    if (specialization)
        filters.specialization = specialization;
    if (location)
        filters.location = location;
    if (isActive !== undefined)
        filters.isActive = isActive === "true";
    const doctors = await doctorModel_1.default.find(filters);
    res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors,
    });
});
// Get doctor by ID
exports.getDoctorById = (0, tryCatchWrapper_1.default)(async (req, res) => {
    const doctor = await doctorModel_1.default.findById(req.params.id);
    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
        success: true,
        data: doctor,
    });
});
// Update doctor
exports.updateDoctor = (0, tryCatchWrapper_1.default)(async (req, res) => {
    const doctor = await doctorModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    logger_1.default.info("Doctor updated", { doctorId: doctor._id });
    res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        data: doctor,
    });
});
// Delete doctor
exports.deleteDoctor = (0, tryCatchWrapper_1.default)(async (req, res) => {
    const doctor = await doctorModel_1.default.findByIdAndDelete(req.params.id);
    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    logger_1.default.info("Doctor deleted", { doctorId: doctor._id });
    res.status(200).json({
        success: true,
        message: "Doctor deleted successfully",
    });
});
