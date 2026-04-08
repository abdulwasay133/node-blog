const { now } = require('mongoose');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');

// exports.postValidation = [
//     body('title').notEmpty().withMessage('Title is required'),
//     body('content').notEmpty().withMessage('Content is required'),
//     // body('image').notEmpty().withMessage('Image URL is required').isURL().withMessage('Image must be a valid URL'),
// ];
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blog_images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
    },
});
exports.uploadFile = multer({ 
    storage: multerStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

exports.postValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    // body('image').notEmpty().withMessage('Image URL is required').isURL().withMessage('Image must be a valid URL'),
];


exports.createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path); // delete uploaded file
        }
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, content , image} = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let imageUrl = '';
        if (req.file) {
            const fileNewName = Date.now() + '-' + req.file.originalname;
            const filePath = `uploads/blog_images/${fileNewName}`;
            fs.renameSync(req.file.path, filePath);
            imageUrl = `/uploads/blog_images/${fileNewName}`;
        }

        const post = new Post({
            title,
            content,
            image: imageUrl,
            author: user._id
        });

        await post.save();
        res.status(201).json(post);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username email');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            if (req.file) {
                fs.unlinkSync(req.file.path); // delete uploaded file
            }
            return res.status(404).json({ error: 'Post not found' });
        }
        if(req.file){
            if(post.image){
                fs.unlinkSync(`.${post.image}`);
            }
            const fileNewName = Date.now() + '-' + req.file.originalname;
            const filePath = `uploads/blog_images/${fileNewName}`;
            fs.renameSync(req.file.path, filePath);
            post.image = `/uploads/blog_images/${fileNewName}`;
        }
        const { title, content } = req.body;
        post.title = title;
        post.content = content;
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // if (post.image) {
        fs.unlinkSync(`.${post.image}`);
        // }
        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};