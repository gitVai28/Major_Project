const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { registerForEvent, getEventParticipants } = require("../controllers/registrationController");

const router = express.Router();

// Participant registers for event
router.post("/register", verifyToken, registerForEvent);

// Organizer gets participants of their event
router.get("/:eventId/participants", verifyToken, getEventParticipants);

module.exports = router;
