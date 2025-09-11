import mongoose, { Schema, Document, Types } from "mongoose";

export interface AppointmentDoc extends Document {
  doctor: Types.ObjectId;       
  patient: string; 
  phone: string;
  reason: string;
  notes?: string;     
  date: Date;
  time: string;
  duration: number;
  status: "booked" | "completed" | "cancelled"; 
}

const appointmentSchema = new Schema<AppointmentDoc>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    reason: {
        type: String,
        trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    time: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
      default: 30,      
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model<AppointmentDoc>("Appointment", appointmentSchema);

export default Appointment;
