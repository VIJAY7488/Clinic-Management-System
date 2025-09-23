import mongoose, { Schema, Document } from "mongoose";

export interface AppointmentDoc extends Document {
  _id: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  reason: string;
  notes?: string;
  date: Date;
  time: string;
  appStatus: "booked" | "completed" | "cancelled";
}

const appointmentSchema = new Schema<AppointmentDoc>(
  {
    doctor: {
      type: Schema.Types.ObjectId, 
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId, 
      ref: "Patient",
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
    date: {
      type: Date,
      required: true,
    },
    appStatus: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model<AppointmentDoc>(
  "Appointment",
  appointmentSchema
);

export default Appointment;
