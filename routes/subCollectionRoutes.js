const express = require('express');
const router = express.Router();
const subCollectionController = require('../controllers/subCollectionController');

router.get('/', subCollectionController.getSubCollections);
router.post('/', subCollectionController.createSubCollection);
router.put('/:id', subCollectionController.updateSubCollection);
router.delete('/:id', subCollectionController.deleteSubCollection);

module.exports = router;
