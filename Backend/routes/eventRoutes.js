const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Create event (only organizer)
router.post(
  "/",
  verifyToken,
  upload.single("banner"), // form field name must be "banner"
  createEvent
);

// Get all events
router.get("/", getAllEvents);

// Get single event by ID
router.get("/:id", getEventById);

// Update event (only organizer who created it)
router.put(
  "/:id",
  verifyToken,
  upload.single("banner"),
  updateEvent
);

module.exports = router;
