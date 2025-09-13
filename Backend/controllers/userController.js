const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create nodemailer transporter (REAL GMAIL)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,   // your Gmail
        pass: process.env.EMAIL_PASS    // your App Password (16-digit)
    }
});

// Helper to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// ------------------- Register User -------------------
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, isOrganizer, skills, interests } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 mins

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isOrganizer: isOrganizer || false,
            skills: skills || [],
            interests: interests || [],
            otp,
            otpExpiry
        });

        // Send OTP email via Gmail
        await transporter.sendMail({
            from: `"Major Project" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: `<p>Hello ${name},</p>
                   <p>Your OTP to verify your email is <b>${otp}</b></p>
                   <p>It will expire in 10 minutes.</p>`
        });

        res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ------------------- Verify OTP -------------------
exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ------------------- Login User -------------------
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



