import mongoose, { Schema } from "mongoose";

interface Availability {
  day: string;       
  startTime: string; 
  endTime: string;   
}

export interface DoctorProps {
  name: string;
  currentPatients: number;
  email: string;
  phone: string;
  specialization: string;
  gender: "Male" | "Female" | "Other";
  location: string;
  availability: Availability[];
  notes?: string;
  isActive: boolean;
}

const AvailabilitySchema = new Schema<Availability>(
  {
    day: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
  },
  { _id: false } // prevents extra _id for each slot
);

const doctorSchema = new Schema<DoctorProps>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    currentPatients: {
      type: Number,
      default: 0,
      min: 0,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],    
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please fill a valid phone number",
      ], 
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: [AvailabilitySchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes 
doctorSchema.index({ name: 1 });
doctorSchema.index({ specialization: 1 });

const Doctor = mongoose.model<DoctorProps>("Doctor", doctorSchema);

export default Doctor;
