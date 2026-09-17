const Admin = require('../models/Admin');

exports.getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id; // From authMiddleware
        const admin = await Admin.findById(adminId).select('-password -resetOtp -resetOtpExpires');
        
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.json({ success: true, admin });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { firstName, lastName, phone } = req.body;
        
        let profileImage = req.body.profileImage; // Fallback to existing if sent as string
        if (req.file) {
            // Construct the URL to the uploaded file
            profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { firstName, lastName, phone, profileImage },
            { new: true, runValidators: true }
        ).select('-password -resetOtp -resetOtpExpires');

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', admin: updatedAdmin });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
