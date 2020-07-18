// REQUIRE MONGOOSE MODULE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: [true, 'Content is required'] },
    likes: { type: Number, required: false, min: 0 },
    createdDate: { type: Date, required: true },
    modifiedDate: { type: Date, required: true },
  },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
