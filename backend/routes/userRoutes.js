import express from "express";
import {
  getProfile,
  updateInterests,
  toggleSavedEvent,
  registerClub,
  getClubRegistrations,
  deleteClubRegistration,
  approveClubEvent,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes (No authentication required)
router.post("/register-club", upload.single("image"), registerClub);

// Protected routes (Require login)
router.use(protect);

router.get("/profile", getProfile);
router.put("/interests", updateInterests);
router.post("/favorites/:eventId", toggleSavedEvent);

// Admin-only notification routes
router.get("/club-registrations", admin, getClubRegistrations);
router.post("/club-registrations/:id/approve", admin, approveClubEvent);
router.delete("/club-registrations/:id", admin, deleteClubRegistration);

export default router;
