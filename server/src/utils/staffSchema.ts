import mongoose, { Document, Schema } from "mongoose";

interface StaffDoc extends Document {
  username: string;
  password: string;
  role?: string;
}

const StaffSchema = new Schema<StaffDoc>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },
});

export const Staff = mongoose.model<StaffDoc>("Staff", StaffSchema, "staff");
