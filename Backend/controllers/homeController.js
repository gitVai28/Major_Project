
const User = require("../models/User");
// controllers/homeController.js
exports.homeController = (req, res) => {
  res.status(200).json({
    message: `Welcome Home 🏠, ${req.user.email}`,
  });
};



// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id; // assuming JWT auth stores user in req.user
    const photoPath = `/uploads/${req.file.filename}`;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePhoto = photoPath;
    await user.save();

    res.json({
      message: "Profile photo uploaded successfully",
      photoUrl: photoPath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const body = req.body || {};   // ✅ ensure req.body is not undefined

    const name = body.name;
    const skills = body.skills;
    const interests = body.interests;
    const isOrganizer = body.isOrganizer;
    const isParticipant = body.isParticipant;
    const currentYear = body.currentYear; // ✅ extract currentYear
    const department = body.department; // ✅ extract department

    // If updating profile photo
    let profilePhotoPath = null;
    if (req.file) {
      profilePhotoPath = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    if (interests) user.interests = Array.isArray(interests) ? interests : interests.split(",").map(i => i.trim());
    if (typeof isOrganizer !== "undefined") user.isOrganizer = (isOrganizer === "true" || isOrganizer === true);
    if (typeof isParticipant !== "undefined") user.isParticipant = (isParticipant === "true" || isParticipant === true);
    if (profilePhotoPath) user.profilePhoto = profilePhotoPath;

    // ✅ Update department
    if (department) {
      user.department = department.trim();
    }
    // Update currentYear (must be 1–4, cannot be null)
    if (typeof currentYear === "undefined" || currentYear === null) {
      return res.status(400).json({ message: "currentYear is required and cannot be null." });
    }

    const yearNum = parseInt(currentYear, 10);
    if (![1, 2, 3, 4].includes(yearNum)) {
      return res.status(400).json({ message: "Invalid currentYear. Must be 1, 2, 3, or 4." });
    }
    user.currentYear = yearNum;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle role: If organizer = true → participant = false, and vice versa
exports.toggleRole = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { role } = req.body;  // expects "organizer" or "participant"

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "organizer") {
      user.isOrganizer = true;
      user.isParticipant = false;
    } else if (role === "participant") {
      user.isOrganizer = false;
      user.isParticipant = true;
    } else {
      return res.status(400).json({ message: "Invalid role. Use 'organizer' or 'participant'." });
    }

    await user.save();

    res.json({
      message: `Role updated successfully. User is now ${role}.`,
      user
    });
  } catch (error) {
    console.error("Toggle role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


