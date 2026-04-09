const validator = require('express-validator');

exports.commentValidation = [
    validator.body('content').notEmpty().withMessage('Comment content is required'),
];