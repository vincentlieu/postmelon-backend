const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const { request } = require("express");

// @route GET api/profile/me

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name, avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile/
// create profile

router.post(
  "/",
  [auth, [check("bio", "Bio is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bio, dob } = req.body;

    // build profile object

    const profileFields = {};
    profileFields.user = req.user.id;

    if (bio) profileFields.bio = bio;
    if (dob) profileFields.dob = dob;

    try {
      let profile = await Profile.findOne({ user: req.user._id });

      if (profile) {
        // update
        profile = await Profile.findByIdAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // create

      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/profile/
// @desc get all profile

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile//user/user_id
// @desc get profile by user id profile

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({ msg: "there is no profile for this user" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route Delete api/profile/
// @desc delete profile, user and post
// @access public

router.delete("/", auth, async (req, res) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "user remove" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
