const { validationResult } = require('express-validator');
const Category = require('../models/Categories.model');
const mongoose = require('mongoose');
require('dotenv').config();

// Create a new category
exports.createCategory = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {    
        const categories = await Category.paginate({}, { page, limit });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
        const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
    try {        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

