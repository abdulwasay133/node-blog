const validator = require('express-validator');

exports.categoryValidation = [
    validator.body('name').notEmpty().withMessage('Category name is required'),
];