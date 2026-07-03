const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getStores,
  getUserDetails,
} = require('../controllers/adminController');
const { userCreateValidation } = require('../validations/userValidation');
const { storeCreateValidation } = require('../validations/storeValidation');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and 'Admin' role
router.use(authenticate, authorize('Admin'));

router.get('/dashboard', getDashboardStats);
router.post('/users', userCreateValidation, validate, createUser);
router.post('/stores', storeCreateValidation, validate, createStore);
router.get('/users', getUsers);
router.get('/stores', getStores);
router.get('/user/:id', getUserDetails);

module.exports = router;
