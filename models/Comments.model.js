const mongoose = require('mongoose');
require('dotenv').config();

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);