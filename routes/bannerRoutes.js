const express = require('express');
const router = express.Router();
const {
    getBanners,
    getActiveBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');

// Define routes
router.get('/', getBanners);
router.get('/active', getActiveBanners);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
