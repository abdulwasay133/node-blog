const mongoose = require('mongoose');
require('dotenv').config();

const Likes = new mongoose.Schema({
    status: { type: String, enum: ['like', 'dislike'], required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });



module.exports = mongoose.model('Likes', Likes);