const express = require('express');
const router = express.Router();
const { register, login, logout, changePassword } = require('../controllers/authController');
const { registerValidation, loginValidation, changePasswordValidation } = require('../validations/authValidation');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);
router.put('/change-password', authenticate, changePasswordValidation, validate, changePassword);

module.exports = router;
