import { Request, Response } from "express";
import Doctor from "../models/doctorModel";
import logger from "../utils/logger";
import wrapAsyncFunction from "../utils/tryCatchWrapper";


// Create doctor
export const createDoctor = wrapAsyncFunction(async (req: Request, res: Response) => {
  const doctor = await Doctor.create(req.body);

  logger.info("Doctor created", { doctorId: doctor._id });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});


// Get all doctors (optional filters: specialization, location, active status)
export const getDoctors = wrapAsyncFunction(async (req: Request, res: Response) => {
  const { specialization, location, isActive } = req.query;

  const filters: any = {};
  if (specialization) filters.specialization = specialization;
  if (location) filters.location = location;
  if (isActive !== undefined) filters.isActive = isActive === "true";

  const doctors = await Doctor.find(filters);

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});


// Get doctor by ID
export const getDoctorById = wrapAsyncFunction(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return res.status(404).json({ success: false, message: "Doctor not found" });
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});



// Update doctor
export const updateDoctor = wrapAsyncFunction(async (req: Request, res: Response) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return res.status(404).json({ success: false, message: "Doctor not found" });
  }

  logger.info("Doctor updated", { doctorId: doctor._id });

  res.status(200).json({
    success: true,
    message: "Doctor updated successfully",
    data: doctor,
  });
});



// Delete doctor
export const deleteDoctor = wrapAsyncFunction(async (req: Request, res: Response) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);

  if (!doctor) {
    return res.status(404).json({ success: false, message: "Doctor not found" });
  }

  logger.info("Doctor deleted", { doctorId: doctor._id });

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});
