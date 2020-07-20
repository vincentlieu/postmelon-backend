// REQUIRE MONGOOSE MODULE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  content: { type: String, required: [true, 'Content is required'] },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      content: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      modifiedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdDate: { type: Date, required: true, default: Date.now },
  modifiedDate: { type: Date, required: true, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
