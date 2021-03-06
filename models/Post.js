// REQUIRE MONGOOSE MODULE
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "users",
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
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
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
  date: {
    type: Date,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
