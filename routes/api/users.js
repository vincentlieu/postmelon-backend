const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

// get current user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      user: req.user.id,
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// get user by id

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.statusa(500).send("server error");
  }
});

// get all user

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Create user registeration

router.post(
  "/",

  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter password with more than 6 characters"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // bring in jwt and validate user

    const { name, email, password } = req.body; // destruckturing

    try {
      // check if user exist
      let user = await User.findOne({ email }); // findOne taking a field which can be username email...
      if (user) {
        // if exist
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      // Get user gravatar // gravatar is image that has on user email

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Create instance user

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password

      const salt = await bcrypt.genSalt(10); // 10 is length

      user.password = await bcrypt.hash(password, salt); // change password to token

      await user.save();

      // return jsonwebtoken
      // create payload

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwttoken"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// create friend

router.put("/friend/:id", auth, async (req, res) => {
  try {
    const friend = await User.findById(req.params.id); // who i wanna add

    const user = await User.findById(req.user.id); // me
    // console.log(friend);
    // console.log(user);

    const newFriend = {
      name: friend.name,
      avatar: friend.avatar,
      user: req.params.id,
    };

    if (
      user.friends.filter((friend) => friend.user.toString() === req.params.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Already add friend" });
    }

    user.friends.unshift(newFriend);
    await user.save();
    console.log(user.friends);

    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route put api/users/unfriend/:id
// @desc friend a post
// @access Private

router.put("/unfriend/:id", auth, async (req, res) => {
  try {
    const friend = await User.findById(req.params.id);

    const user = await User.findById(req.user.id);
    console.log(friend);
    console.log(user);
    if (
      user.friends.filter((friend) => friend.user.toString() === req.params.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "You has not yet been friend" });
    }

    // get remove index
    console.log(user.friend);
    const removeIndex = user.friends

      .map((friend) => friend.user.toString())
      .indexOf(req.user.id);

    user.friends.splice(removeIndex, 1);
    await user.save();

    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// create bio

router.put("/bio/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          bio: req.body.bio,
          modifiedDate: new Date(Date.now()),
        },
      },
      { new: true }
    ).then((user) => res.json(user));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route Delete api/users/
// @desc delete user
// @access public

router.delete("/", auth, async (req, res) => {
  try {
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    await Post.deleteMany({ authorId: req.user.id }, (err, result) => {
      if (err) {
        res.send(err);
      }
    });

    res.json({ msg: "user remove" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
