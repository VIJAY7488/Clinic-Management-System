import { Router } from "express"
import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  assignDoctor,
  updateWaitingTime,
} from "../controller/patientController"

const router = Router()


router.post("/", addPatient)            // Create patient
router.get("/", getPatients)            // Get all patients
router.get("/:id", getPatientById)      // Get one patient
router.put("/:id", updatePatient)       // Update patient
router.delete("/:id", deletePatient)    // Delete patient
router.put("/:id/assign-doctor", assignDoctor)         // Assign doctor
router.put("/:id/waiting-time", updateWaitingTime)     // Update waiting time

export default router
