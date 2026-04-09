const validator = require('express-validator');

exports.likeValidation = [
    validator.body('status').isIn(['like', 'dislike']).withMessage('Status must be like or dislike'),
];