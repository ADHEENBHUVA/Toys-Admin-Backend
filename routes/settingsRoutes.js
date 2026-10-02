const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, settingsController.getSettings);
router.put('/social', authMiddleware, settingsController.updateSocialLinks);
router.put('/discount', authMiddleware, settingsController.updateDiscountDisplayType);

module.exports = router;
