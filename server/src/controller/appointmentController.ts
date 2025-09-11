import { Request, Response } from "express";
import Appointment from "../models/appointmentModel";
import wrapAsyncFunction from "../utils/tryCatchWrapper";
import logger from "../utils/logger";


// Get all appointments
export const getAppointments = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Fetching all appointments");
  const appointments = await Appointment.find().populate("doctor");
  res.status(200).json({success: true, appointments});
});

// Get appointment by ID
export const getAppointmentById = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info(`Fetching appointment ${req.params.id}`);
  const appointment = await Appointment.findById(req.params.id).populate("doctor");

  if (!appointment) {
    logger.warn(`Appointment not found with id ${req.params.id}`);
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.status(200).json({success: true, appointment});
});

// create new appointment
export const createAppointment = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("Creating new appointment", { body: req.body });

  const appointment = new Appointment(req.body);
  const savedAppointment = await appointment.save();

  res.status(201).json({success: true, savedAppointment});
});

// update appointment
export const updateAppointment = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info(`Updating appointment ${req.params.id}`, { body: req.body });

  const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("doctor");

  if (!updatedAppointment) {
    logger.warn(`Appointment not found with id ${req.params.id}`);
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.status(200).json(updatedAppointment);
});

//    Delete appointment
export const deleteAppointment = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info(`Deleting appointment ${req.params.id}`);

  const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!deletedAppointment) {
    logger.warn(`Appointment not found with id ${req.params.id}`);
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.status(200).json({ message: "Appointment deleted successfully" });
});

// Update appointment status
export const updateAppointmentStatus = wrapAsyncFunction(async (req: Request, res: Response) => {
  logger.info("status api end point hit");
  const { status } = req.body;

  logger.info(`Updating status for appointment ${req.params.id}`, { status });

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    logger.warn(`Appointment not found with id ${req.params.id}`);
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.status = status || appointment.status;

  const updated = await appointment.save();
  res.status(200).json(updated);
});
