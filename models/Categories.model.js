const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
require('dotenv').config();

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });


categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', categorySchema);