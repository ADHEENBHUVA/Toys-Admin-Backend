const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/', reviewController.getAllReviews);
router.put('/:id/status', reviewController.updateReviewStatus);

module.exports = router;
