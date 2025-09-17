const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { sendMessageToParticipants } = require("../controllers/messageController");

// Organizer sends message to participants
router.post("/:eventId/message", verifyToken, sendMessageToParticipants);

module.exports = router;