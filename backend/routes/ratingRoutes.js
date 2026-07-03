const express = require('express');
const router = express.Router();
const { submitRating, updateRating, getStoreRatings } = require('../controllers/ratingController');
const { ratingValidation } = require('../validations/ratingValidation');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, authorize('User'), ratingValidation, validate, submitRating);
router.put('/:id', authenticate, authorize('User'), ratingValidation, validate, updateRating);
router.get('/store/:storeId', authenticate, getStoreRatings);

module.exports = router;
