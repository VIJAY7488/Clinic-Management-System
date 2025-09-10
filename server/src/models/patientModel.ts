import mongoose, { Schema, Document, Types } from "mongoose"

export interface IPatient extends Document {
  name: string
  phone: string
  reason: string
  priority: "normal" | "urgent" | "emergency"
  status: "waiting" | "with-doctor" | "completed" | "cancelled"
  notes?: string
  doctor?: Types.ObjectId // reference to Doctor collection
  waitingTime?: number    // in minutes
  createdAt: Date
  updatedAt: Date
}

const PatientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["normal", "urgent", "emergency"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["waiting", "with-doctor", "completed", "cancelled"],
      default: "waiting",
    },
    notes: {
      type: String,
      trim: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor", // assumes you have a Doctor model
    },
    waitingTime: {
      type: Number, // in minutes
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IPatient>("Patient", PatientSchema)
