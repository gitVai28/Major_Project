// controllers/registrationController.js
const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

// Register participant for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id; // from JWT

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if registration deadline has passed
    if (new Date() > new Date(event.lastDateToRegister)) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    // Prevent duplicate registration
    const existing = await Registration.findOne({ where: { userId, eventId } });
    if (existing) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Register participant
    await Registration.create({ userId, eventId });

    res.json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Organizer fetches all participants for their event
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;

    // Check if event belongs to this organizer
    const event = await Event.findOne({ where: { id: eventId, organizerId } });
    if (!event) {
      return res.status(403).json({ message: "Not authorized or event not found" });
    }

    // Fetch participants using the alias "participants"
    const participants = await event.getParticipants({
      attributes: ["id", "name", "email", "skills", "interests"],
      joinTableAttributes: [] // exclude Registration fields
    });

    res.json({ event: event.title, participants });
  } catch (error) {
    console.error("Get participants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
