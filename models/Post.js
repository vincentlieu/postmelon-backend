// REQUIRE MONGOOSE MODULE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    content: { type: String, required: true },
    createdDate: { type: Date, required: true },
    modifiedDate: { type: Date, required: true },
  },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
