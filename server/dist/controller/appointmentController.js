"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatus = exports.deleteAppointment = exports.updateAppointment = exports.getAppointmentById = exports.getAllAppointments = exports.createAppointment = void 0;
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const tryCatchWrapper_1 = __importDefault(require("../utils/tryCatchWrapper"));
const logger_1 = __importDefault(require("../utils/logger"));
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const patientModel_1 = __importDefault(require("../models/patientModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// create new appointment
exports.createAppointment = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("Create appointment endpoint hit");
    const { doctor, patient, reason, notes, date, time } = req.body;
    const { name, phone, age } = patient;
    // 1. Find latest queue number for this doctor on this date
    const normalizedDate = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
    const lastPatient = await patientModel_1.default
        .findOne({ doctor, createdAt: { $gte: new Date(normalizedDate) } })
        .sort({ queueNumber: -1 });
    const nextQueueNumber = lastPatient ? lastPatient.queueNumber + 1 : 1;
    // 2. Create appointment (without queue fields)
    const newAppointment = new appointmentModel_1.default({
        doctor,
        reason,
        notes,
        date,
        time,
        appStatus: "booked",
    });
    const savedAppointment = await newAppointment.save();
    // 3. Find or create patient with appointmentId
    let existingPatient = await patientModel_1.default.findOne({ phone, doctor });
    if (!existingPatient) {
        existingPatient = new patientModel_1.default({
            name,
            phone,
            age,
            doctor,
            queueNumber: nextQueueNumber,
            queueStatus: "waiting",
            appointmentId: savedAppointment._id,
        });
    }
    else {
        existingPatient.queueNumber = nextQueueNumber;
        existingPatient.queueStatus = "waiting";
        existingPatient.appointmentId = savedAppointment._id;
    }
    await existingPatient.save();
    // 4. Update appointment with patient reference
    savedAppointment.patient = existingPatient._id;
    await savedAppointment.save();
    // 5. Increment doctor’s current patient count
    await doctorModel_1.default.findByIdAndUpdate(doctor, { $inc: { currentPatients: 1 } }, { new: true });
    res.status(201).json({ success: true, savedAppointment });
});
// Get all appointments
const getAllAppointments = async (req, res) => {
    logger_1.default.info("Get all appointments fetch hit");
    try {
        const appointments = await appointmentModel_1.default.find()
            .populate("doctor", "name specialization location")
            .populate("patient", "name age phone queueNumber queueStatus appointmentId") // fetch directly
            .lean();
        logger_1.default.info(`Appointments fetched: ${appointments.length}`);
        res.json({ success: true, appointments });
    }
    catch (error) {
        logger_1.default.error("Error fetching appointments:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllAppointments = getAllAppointments;
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
// update appointment
exports.updateAppointment = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info(`Updating appointment for patient ${req.params.id}`, { body: req.body });
    const { doctor, reason, notes, date, time, appStatus, patient } = req.body;
    // 1. Find patient by ID
    const patientDoc = await patientModel_1.default.findById(req.params.id);
    if (!patientDoc) {
        logger_1.default.warn(`Patient not found with id ${req.params.id}`);
        return res.status(404).json({ success: false, message: "Patient not found" });
    }
    // 2. Get appointmentId from patient
    const appointment = await appointmentModel_1.default.findById(patientDoc.appointmentId);
    if (!appointment) {
        logger_1.default.warn(`Appointment not found for patient ${req.params.id}`);
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    const oldDoctorId = appointment.doctor;
    // 3. Update appointment fields
    if (doctor && doctor.toString() !== oldDoctorId.toString()) {
        // Doctor changed → adjust currentPatients
        await doctorModel_1.default.findByIdAndUpdate(oldDoctorId, { $inc: { currentPatients: -1 } });
        await doctorModel_1.default.findByIdAndUpdate(doctor, { $inc: { currentPatients: 1 } });
        appointment.doctor = doctor;
    }
    if (reason)
        appointment.reason = reason;
    if (notes)
        appointment.notes = notes;
    if (date)
        appointment.date = date;
    if (time)
        appointment.time = time;
    if (appStatus)
        appointment.appStatus = appStatus;
    // 4. Update patient fields (if provided in body)
    if (patient) {
        if (patient.name)
            patientDoc.name = patient.name;
        if (patient.age)
            patientDoc.age = patient.age;
        if (patient.phone)
            patientDoc.phone = patient.phone;
        await patientDoc.save();
    }
    // 5. Save appointment
    const updatedAppointment = await appointment.save();
    // 6. Populate doctor + patient for response
    await updatedAppointment.populate("doctor", "name specialization location");
    await updatedAppointment.populate("patient", "name age phone queueNumber queueStatus");
    res.status(200).json({ success: true, appointment: updatedAppointment });
});
// Delete appointment
exports.deleteAppointment = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info(`Deleting appointment ${req.params.id}`);
    // 1. Find and delete appointment
    const deletedAppointment = await appointmentModel_1.default.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
        logger_1.default.warn(`Appointment not found with id ${req.params.id}`);
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    // 2. Decrease doctor's currentPatients count (but not below 0)
    await doctorModel_1.default.findByIdAndUpdate(deletedAppointment.doctor, [
        {
            $set: {
                currentPatients: {
                    $max: [{ $add: ["$currentPatients", -1] }, 0],
                },
            },
        },
    ]);
    // 3.delete patient document if it's tied only to this appointment
    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
    });
});
// Update appointment + queue status
exports.updateAppointmentStatus = (0, tryCatchWrapper_1.default)(async (req, res) => {
    logger_1.default.info("status api endpoint hit");
    const { queueStatus } = req.body;
    // Start transaction session
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Step 1: Find patient
        const patientDoc = await patientModel_1.default.findById(req.params.id).session(session);
        if (!patientDoc) {
            logger_1.default.warn(`Patient not found with id ${req.params.id}`);
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        // Step 2: Find linked appointment
        const appointment = await appointmentModel_1.default.findById(patientDoc.appointmentId).session(session);
        if (!appointment) {
            logger_1.default.warn(`Appointment not found for patient ${req.params.id}`);
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        const oldAppStatus = appointment.appStatus;
        // Step 3: Update patient queueStatus
        if (queueStatus) {
            patientDoc.queueStatus = queueStatus;
            await patientDoc.save({ session });
        }
        // Step 4: Derive appStatus
        switch (queueStatus) {
            case "completed":
                appointment.appStatus = "completed";
                break;
            case "skipped":
                appointment.appStatus = "cancelled";
                break;
            case "waiting":
            case "with-doctor":
                appointment.appStatus = "booked";
                break;
        }
        // Step 5: Save appointment
        const updatedAppointment = await appointment.save({ session });
        // Step 6: Adjust doctor’s currentPatients if needed
        if ((updatedAppointment.appStatus === "cancelled" && oldAppStatus !== "cancelled") ||
            (updatedAppointment.appStatus === "completed" && oldAppStatus !== "completed")) {
            await doctorModel_1.default.findByIdAndUpdate(appointment.doctor, { $inc: { currentPatients: -1 } }, { session });
        }
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, appointment: updatedAppointment });
    }
    catch (err) {
        // Rollback on error
        await session.abortTransaction();
        session.endSession();
        logger_1.default.error("Error updating appointment status", err);
        res.status(500).json({ success: false, message: "Failed to update appointment status" });
    }
});
