import { Router } from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controller/doctorController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createDoctor);
router.get("/", authenticate, getDoctors);
router.get("/:id", authenticate, getDoctorById);
router.put("/:id", authenticate, updateDoctor);
router.delete("/:id", authenticate, deleteDoctor);

export default router;
