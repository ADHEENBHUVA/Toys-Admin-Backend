const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate 6 digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
        }
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                profileImage: admin.profileImage
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found with this email' });
        }

        const otp = generateOTP();
        admin.resetOtp = otp;
        admin.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await admin.save();

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@toysportal.com',
            to: admin.email,
            subject: 'Toys Portal Admin - Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Password Reset Request</h2>
                    <p>You requested to reset your Admin Portal password.</p>
                    <p>Your 6-digit OTP code is:</p>
                    <h1 style="background: #F3F4F6; padding: 15px; text-align: center; letter-spacing: 5px; font-size: 32px; color: #111827; border-radius: 8px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = getTransporter();
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'OTP sent to your email' });
        } else {
            // Ethereal Mock Email Service
            console.log("Creating Ethereal test account on the fly since no Gmail configured...");
            const testAccount = await nodemailer.createTestAccount();
            const etherealTransporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            const info = await etherealTransporter.sendMail({
                ...mailOptions,
                from: testAccount.user
            });
            const previewUrl = nodemailer.getTestMessageUrl(info);

            res.json({
                success: true,
                message: 'OTP sent via Ethereal!',
                mockOtp: otp,
                previewUrl
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const admin = await Admin.findOne({
            email,
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Error verifying OTP' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const admin = await Admin.findOne({
            email,
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        admin.resetOtp = undefined;
        admin.resetOtpExpires = undefined;
        await admin.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Error resetting password' });
    }
};
