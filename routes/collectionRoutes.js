const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', collectionController.getAllCollections);
router.post('/', upload.single('image'), collectionController.createCollection);
router.put('/:id', upload.single('image'), collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
