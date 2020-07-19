const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bio: {
    type: String,
  },
  dob: {
    type: Date,
    required: true,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
