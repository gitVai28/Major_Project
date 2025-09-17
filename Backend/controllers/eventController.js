const Event = require("../models/Event");
const User = require("../models/User");

// Create new event (only organizers)
exports.createEvent = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const user = await User.findByPk(userId);

    if (!user || !user.isOrganizer) {
      return res.status(403).json({ message: "Only organizers can create events" });
    }

    const { title, description, date, location, lastDateToRegister } = req.body;

    if (!title || !description || !date || !location || !lastDateToRegister) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    let bannerPath = null;
    if (req.file) {
      bannerPath = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      lastDateToRegister,
      organizerId: userId,
      banner: bannerPath,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, as: "organizer", attributes: ["id", "name", "email"] }],
    });
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [{ model: User, as: "organizer", attributes: ["id", "name", "email"] }],
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update event (only by the organizer who created it)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // from JWT

    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId !== userId) {
      return res.status(403).json({ message: "You are not the organizer of this event" });
    }

    const { title, description, date, location, lastDateToRegister } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (lastDateToRegister) event.lastDateToRegister = lastDateToRegister;

    if (req.file) {
      event.banner = `/uploads/${req.file.filename}`;
    }

    await event.save();

    res.json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
