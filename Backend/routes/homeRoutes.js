// routes/homeRoutes.js
const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { homeController,uploadProfilePhoto,getUser,updateUserProfile,deleteUserProfile,toggleRole} = require('../controllers/homeController');
const upload = require("../middlewares/uploadMiddleware");


const router = express.Router();

// Protected route
router.get('/', verifyToken, homeController);
router.post(
  "/upload-photo",
  verifyToken,
  upload.single("profilePhoto"), // form field name must be "profilePhoto"
  uploadProfilePhoto
);

router.get("/me", verifyToken, getUser);                // Get profile
router.put("/me", verifyToken,upload.single("profilePhoto"), updateUserProfile);      // Update profile
router.delete("/me", verifyToken, deleteUserProfile);   // Delete profile
router.put("/toggle-role", verifyToken, toggleRole);

module.exports = router;
