import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  age?: string;
  phone: string;
  doctor: mongoose.Types.ObjectId;
  queueNumber: number;
  queueStatus: "waiting" | "with-doctor" | "completed" | "skipped";
  appointmentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,   
      ref: "Doctor",
      required: true,
    },
    queueNumber: {
      type: Number,
      required: true,
    },
    queueStatus: {
      type: String,
      enum: ["waiting", "with-doctor", "completed", "skipped"],
      default: "waiting",
    },
    appointmentId: {
      type: Schema.Types.ObjectId,   
      ref: "Appointment",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPatient>("Patient", PatientSchema);
