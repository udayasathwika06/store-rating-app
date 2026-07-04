const { body } = require('express-validator');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/[\]\\~`';]).{8,16}$/;

const storeCreateValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Store Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .toLowerCase(),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Store Address cannot exceed 400 characters'),
  body('ownerName')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Owner Name must be between 2 and 60 characters'),
  body('ownerEmail')
    .trim()
    .isEmail()
    .withMessage('Must be a valid owner email address')
    .toLowerCase(),
  body('ownerPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Owner Password must be between 8 and 16 characters')
    .matches(passwordRegex)
    .withMessage('Owner Password must contain at least one uppercase letter, one number, and one special character'),
];

module.exports = {
  storeCreateValidation,
};
