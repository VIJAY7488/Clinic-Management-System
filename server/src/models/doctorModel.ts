import mongoose, { Schema } from "mongoose";

interface Availability {
  day: string;       
  startTime: string; 
  endTime: string;   
}

export interface DoctorProps {
  name: string;
  specialization: string;
  gender: "Male" | "Female" | "Other";
  location: string;
  availability: Availability[];
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
