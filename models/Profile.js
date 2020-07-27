const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
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
  bio: {
    type: String,
  },
  dob: {
    type: Date,
    required: true,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
