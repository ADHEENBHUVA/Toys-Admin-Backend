const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.get('/', shippingController.getShippingSettings);
router.put('/', shippingController.updateShippingSettings);

module.exports = router;
