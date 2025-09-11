"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controller/appointmentController");
const router = (0, express_1.Router)();
// GET all appointments
router.get("/", appointmentController_1.getAppointments);
// GET single appointment by ID
router.get("/:id", appointmentController_1.getAppointmentById);
// CREATE appointment
router.post("/", appointmentController_1.createAppointment);
// UPDATE appointment
router.put("/:id", appointmentController_1.updateAppointment);
// DELETE appointment
router.delete("/:id", appointmentController_1.deleteAppointment);
// UPDATE appointment status (booked → completed/cancelled)
router.patch("/:id/status", appointmentController_1.updateAppointmentStatus);
exports.default = router;
