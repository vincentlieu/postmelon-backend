const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  bio: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      content: {
        type: String,
      },

      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  dob: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

      dob: {
        type: Date,
      },
    },
  ],

  friends: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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

module.exports = User = mongoose.model("user", UserSchema);
