const { body } = require('express-validator');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/[\]\\~`';]).{8,16}$/;

const userCreateValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(passwordRegex)
    .withMessage('Password must contain at least one uppercase letter, one number, and one special character'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  body('role')
    .isIn(['Admin', 'User', 'Store Owner'])
    .withMessage('Role must be Admin, User, or Store Owner'),
];

module.exports = {
  userCreateValidation,
};
