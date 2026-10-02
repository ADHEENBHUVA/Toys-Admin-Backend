const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

router.get('/', subscriberController.getSubscribers);
router.delete('/:id', subscriberController.deleteSubscriber);

module.exports = router;
