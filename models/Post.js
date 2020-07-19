// REQUIRE MONGOOSE MODULE
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: [true, "Content is required"] },
  likes: { type: Number, required: false, min: 0 },
  createdDate: { type: Date, required: true },
  modifiedDate: { type: Date, required: true },
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
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
