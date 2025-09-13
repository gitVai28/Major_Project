
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
