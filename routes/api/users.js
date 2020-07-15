const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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

    res.send("user route");
  }
);

module.exports = router;
