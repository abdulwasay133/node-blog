const express = require('express');
const router = express.Router();
// const { body, query } = require('express-validator');
const { createPost, getPosts, getPostById, updatePost, deletePost, uploadFile, postValidation } = require('../controllers/post.controller');
const auth = require('../middleware/auth');

router.post('/posts', auth,uploadFile.single('image'), ...postValidation, createPost);
router.get('/posts', auth,  getPosts);
router.get('/posts/:id', auth, getPostById);
router.put('/posts/:id', auth, uploadFile.single('image'), ...postValidation, updatePost);
router.delete('/posts/:id', auth, deletePost);

module.exports = router;