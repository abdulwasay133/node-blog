const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { categoryValidation } = require('../utils/category.validation');
const auth = require('../middleware/auth');


router.post('/categories', auth, categoryValidation, createCategory);
router.get('/categories', auth, getCategories);
router.get('/categories/:id', auth, getCategoryById);
router.put('/categories/:id', auth, categoryValidation, updateCategory);
router.delete('/categories/:id', auth, deleteCategory);

module.exports = router;