const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost, uploadFile, postValidation, createComment, setLike } = require('../controllers/post.controller');
const { likeValidation } = require('../utils/Like.validation');
const { commentValidation } = require('../utils/comment.validation..js');
const auth = require('../middleware/auth');

router.post('/posts', auth,uploadFile.single('image'), ...postValidation, createPost);
router.get('/posts', auth,  getPosts);
router.get('/posts/:id', auth, getPostById);
router.put('/posts/:id', auth, uploadFile.single('image'), ...postValidation, updatePost);
router.delete('/posts/:id', auth, deletePost);

router.post('/posts/:id/comments', auth, ...commentValidation, createComment);
router.post('/posts/:id/likes', auth, ...likeValidation, setLike);

module.exports = router;