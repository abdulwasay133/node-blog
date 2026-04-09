const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
require('dotenv').config();

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });


postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post"
});

postSchema.virtual("likes", {
    ref: "Likes",
    localField: "_id",
    foreignField: "post"
});


postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema);