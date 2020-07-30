const jwt = require("jsonwebtoken");
const config = require("config");
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from header

  const token = req.header("x-auth-token");
  // check if there is no token

  if (!token) {
    return res.status(401).json({ msg: "No token authorlization denied" });
  }
  // verify token

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);

    req.user = decoded.user; // take request object assign value to user
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
