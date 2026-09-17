const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', authMiddleware, adminController.getAdminProfile);
router.put('/profile', authMiddleware, upload.single('profileImage'), adminController.updateAdminProfile);

module.exports = router;
