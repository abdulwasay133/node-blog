const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { signup, login, signupvalidation, loginvalidation } = require('../controllers/user.controller');


router.post('/signup', signupvalidation , signup);
router.post('/login', loginvalidation, login);
    

module.exports = router;