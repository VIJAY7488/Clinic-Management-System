import { Request, Response } from "express"
import Patient from "../models/patientModel"
import Doctor from "../models/doctorModel"
import wrapAsyncFunction from "../utils/tryCatchWrapper"
import logger from "../utils/logger"

// Create new patient
export const addPatient = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Adding new patient", { body: req.body })

  const patient = new Patient(req.body)
  await patient.save()

  logger.info("Patient created successfully", { id: patient._id })
  res.status(201).json(patient)
})

// Get all patients
export const getPatients = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Fetching all patients")

  const patients = await Patient.find().populate("doctor")

  logger.info("Patients fetched", { count: patients.length })
  res.json(patients)
})

// Get single patient
export const getPatientById = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Fetching patient", { id: req.params.id })

  const patient = await Patient.findById(req.params.id).populate("doctor")
  if (!patient) {
    logger.warn("Patient not found", { id: req.params.id })
    return res.status(404).json({ error: "Patient not found" })
  }

  logger.info("Patient fetched", { id: patient._id })
  res.json(patient)
})

// Update patient
export const updatePatient = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Updating patient", { id: req.params.id, body: req.body })

  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("doctor")

  if (!patient) {
    logger.warn("Patient not found for update", { id: req.params.id })
    return res.status(404).json({ error: "Patient not found" })
  }

  logger.info("Patient updated", { id: patient._id })
  res.json(patient)
})

// Delete patient
export const deletePatient = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Deleting patient", { id: req.params.id })

  const patient = await Patient.findByIdAndDelete(req.params.id)
  if (!patient) {
    logger.warn("Patient not found for delete", { id: req.params.id })
    return res.status(404).json({ error: "Patient not found" })
  }

  logger.info("Patient deleted", { id: patient._id })
  res.json({ message: "Patient deleted successfully" })
})

// Assign a doctor to a patient
export const assignDoctor = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Assigning doctor", { patientId: req.params.id, doctorId: req.body.doctorId })

  const patient = await Patient.findById(req.params.id)
  if (!patient) {
    logger.warn("Patient not found for doctor assignment", { id: req.params.id })
    return res.status(404).json({ error: "Patient not found" })
  }

  const doctor = await Doctor.findById(req.body.doctorId)
  if (!doctor) {
    logger.warn("Doctor not found", { id: req.body.doctorId })
    return res.status(404).json({ error: "Doctor not found" })
  }

  patient.doctor = doctor._id
  await patient.save()

  logger.info("Doctor assigned", { patientId: patient._id, doctorId: doctor._id })
  res.json(await patient.populate("doctor"))
})

// Update waiting time
export const updateWaitingTime = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Updating waiting time", { patientId: req.params.id, waitingTime: req.body.waitingTime })

  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { waitingTime: req.body.waitingTime },
    { new: true }
  )

  if (!patient) {
    logger.warn("Patient not found for waiting time update", { id: req.params.id })
    return res.status(404).json({ error: "Patient not found" })
  }
  res.json(patient)
})
