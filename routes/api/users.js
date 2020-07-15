const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

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

module.exports = router;
