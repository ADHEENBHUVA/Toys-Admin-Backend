const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

router.get('/', couponController.getAllCoupons);
router.post('/', couponController.createCoupon);

module.exports = router;
