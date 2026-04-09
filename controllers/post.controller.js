const { now } = require('mongoose');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const Comment = require('../models/Comments.model');
const Likes = require('../models/Liks.model');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');

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
    body('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Category must be a valid ID'),
    // body('image').notEmpty().withMessage('Image URL is required').isURL().withMessage('Image must be a valid URL'),
];


exports.createPost = async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log('error present');
        if (req.file) {
            fs.unlinkSync(req.file.path); // delete uploaded file
        }
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, content , image, category } = req.body;

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
            author: user._id,
            category: req.body.category
        });

        await post.save();
        res.status(201).json(post);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const posts = await Post.paginate({}, { page, limit, sort: { createdAt: 1 }, populate: [
            { path: 'author', select: 'username email' },
            { path: 'comments', select: 'content author' },
            { path: 'likes' },
            { path: 'category', select: 'name' }
        ] });

        posts.docs = posts.docs.map(post => ({
            ...post.toJSON(),
            likesCount: post.likes.length,
            commentsCount: post.comments.length
        }));

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username email')
        .populate('comments', 'content author')
        .populate('category', 'name');
        post.likes = await Likes.countDocuments({ post: post._id });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postsWithCounts = posts.map(post => ({
            ...post.toJSON(),
            likesCount: post.likes.length,
            commentsCount: post.comments.length
        }));

        res.status(200).json(postsWithCounts);
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

exports.createComment = async (req, res) => {
    try {
        console.log(req.user);
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const comment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: post._id
        });
        await comment.save();
        res.status(201).json(comment);

    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.setLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const like = new Likes({
            status: req.body.status,
            author: req.user.id,
            post: post._id
        });
        await like.save();
        res.status(201).json(like);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};