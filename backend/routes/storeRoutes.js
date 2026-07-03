const express = require('express');
const router = express.Router();
const { getStores, getStoreById, getOwnerStoreStats } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, getStores);
router.get('/owner/stats', authenticate, authorize('Store Owner'), getOwnerStoreStats);
router.get('/:id', authenticate, getStoreById);

module.exports = router;
