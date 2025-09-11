"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controller/patientController");
const router = (0, express_1.Router)();
router.post("/", patientController_1.addPatient); // Create patient
router.get("/", patientController_1.getPatients); // Get all patients
router.get("/:id", patientController_1.getPatientById); // Get one patient
router.put("/:id", patientController_1.updatePatient); // Update patient
router.delete("/:id", patientController_1.deletePatient); // Delete patient
router.put("/:id/assign-doctor", patientController_1.assignDoctor); // Assign doctor
router.put("/:id/waiting-time", patientController_1.updateWaitingTime); // Update waiting time
exports.default = router;
