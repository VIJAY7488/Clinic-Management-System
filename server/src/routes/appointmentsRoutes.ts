import { Router } from "express";
import {
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getAllAppointments,
} from "../controller/appointmentController";

const router = Router();

// GET all appointments
router.get("/", getAllAppointments);

// GET single appointment by ID
router.get("/:id", getAppointmentById);

// CREATE appointment
router.post("/", createAppointment);

// UPDATE appointment
router.put("/:id", updateAppointment);

// DELETE appointment
router.delete("/:id", deleteAppointment);

// UPDATE appointment status (booked → completed/cancelled)
router.patch("/:id/status", updateAppointmentStatus);

export default router;
