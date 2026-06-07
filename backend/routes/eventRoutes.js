import express from "express";
import {
  getAllEvents,
  getRecommendedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createEventReview,
} from "../controllers/eventController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/recommended", protect, getRecommendedEvents);
router.get("/:id", getEventById);

// Review route for logged-in users
router.post("/:id/reviews", protect, createEventReview);

// Admin only routes
router.post("/", protect, admin, upload.single("image"), createEvent);
router.put("/:id", protect, admin, upload.single("image"), updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

export default router;
