// routes/homeRoutes.js
const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { homeController,uploadProfilePhoto } = require('../controllers/homeController');
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

module.exports = router;
