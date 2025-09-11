"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWaitingTime = exports.assignDoctor = exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getPatients = exports.addPatient = void 0;
const patientModel_1 = __importDefault(require("../models/patientModel"));
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const tryCatchWrapper_1 = __importDefault(require("../utils/tryCatchWrapper"));
const logger_1 = __importDefault(require("../utils/logger"));
// Create new patient
exports.addPatient = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Adding new patient", { body: req.body });
    const patient = new patientModel_1.default(req.body);
    await patient.save();
    logger_1.default.info("Patient created successfully", { id: patient._id });
    res.status(201).json(patient);
});
// Get all patients
exports.getPatients = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Fetching all patients");
    const patients = await patientModel_1.default.find().populate("doctor");
    logger_1.default.info("Patients fetched", { count: patients.length });
    res.json(patients);
});
// Get single patient
exports.getPatientById = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Fetching patient", { id: req.params.id });
    const patient = await patientModel_1.default.findById(req.params.id).populate("doctor");
    if (!patient) {
        logger_1.default.warn("Patient not found", { id: req.params.id });
        return res.status(404).json({ error: "Patient not found" });
    }
    logger_1.default.info("Patient fetched", { id: patient._id });
    res.json(patient);
});
// Update patient
exports.updatePatient = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Updating patient", { id: req.params.id, body: req.body });
    const patient = await patientModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).populate("doctor");
    if (!patient) {
        logger_1.default.warn("Patient not found for update", { id: req.params.id });
        return res.status(404).json({ error: "Patient not found" });
    }
    logger_1.default.info("Patient updated", { id: patient._id });
    res.json(patient);
});
// Delete patient
exports.deletePatient = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Deleting patient", { id: req.params.id });
    const patient = await patientModel_1.default.findByIdAndDelete(req.params.id);
    if (!patient) {
        logger_1.default.warn("Patient not found for delete", { id: req.params.id });
        return res.status(404).json({ error: "Patient not found" });
    }
    logger_1.default.info("Patient deleted", { id: patient._id });
    res.json({ message: "Patient deleted successfully" });
});
// Assign a doctor to a patient
exports.assignDoctor = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Assigning doctor", { patientId: req.params.id, doctorId: req.body.doctorId });
    const patient = await patientModel_1.default.findById(req.params.id);
    if (!patient) {
        logger_1.default.warn("Patient not found for doctor assignment", { id: req.params.id });
        return res.status(404).json({ error: "Patient not found" });
    }
    const doctor = await doctorModel_1.default.findById(req.body.doctorId);
    if (!doctor) {
        logger_1.default.warn("Doctor not found", { id: req.body.doctorId });
        return res.status(404).json({ error: "Doctor not found" });
    }
    patient.doctor = doctor._id;
    await patient.save();
    logger_1.default.info("Doctor assigned", { patientId: patient._id, doctorId: doctor._id });
    res.json(await patient.populate("doctor"));
});
// Update waiting time
exports.updateWaitingTime = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Updating waiting time", { patientId: req.params.id, waitingTime: req.body.waitingTime });
    const patient = await patientModel_1.default.findByIdAndUpdate(req.params.id, { waitingTime: req.body.waitingTime }, { new: true });
    if (!patient) {
        logger_1.default.warn("Patient not found for waiting time update", { id: req.params.id });
        return res.status(404).json({ error: "Patient not found" });
    }
    logger_1.default.info("Waiting time updated", { id: patient._id, waitingTime: patient.waitingTime });
    res.json(patient);
});
