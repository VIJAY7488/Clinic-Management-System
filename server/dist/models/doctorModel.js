"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AvailabilitySchema = new mongoose_1.Schema({
    day: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
}, { _id: false } // prevents extra _id for each slot
);
const doctorSchema = new mongoose_1.Schema({
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
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
// Indexes 
doctorSchema.index({ name: 1 });
doctorSchema.index({ specialization: 1 });
const Doctor = mongoose_1.default.model("Doctor", doctorSchema);
exports.default = Doctor;
