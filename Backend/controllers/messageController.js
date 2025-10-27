const { Event, User } = require("../models/associations");
const nodemailer = require("nodemailer");

// 📩 Organizer sends message to all participants
exports.sendMessageToParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message, subject } = req.body;
    const organizerId = req.user.id; // from JWT

    // Check if event exists and belongs to this organizer
    const event = await Event.findOne({ 
      where: { id: eventId, organizerId },
      include: [{
        model: User,
        as: 'participants',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!event) {
      return res.status(403).json({ message: "Not authorized or event not found" });
    }

    // Get participants from the included association
    const participants = event.participants;
    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: "No participants found for this event" });
    }

    // Setup mail transporter (you can use Gmail, SMTP, etc.)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or SMTP config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to all participants
    const emails = participants.map((p) => p.email);
    await transporter.sendMail({
      from: `"${req.user.name}" <${process.env.EMAIL_USER}>`,
      to: emails, // all participants
      subject: subject || `Message from Organizer of ${event.title}`,
      text: message,
    });

    res.json({ message: "Emails sent successfully", sentTo: emails.length });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};