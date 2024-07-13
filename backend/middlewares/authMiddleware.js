const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  let statusCode; // Initialize statusCode variable

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_KEY);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      statusCode = 401; // Set statusCode value
      throw new Error("Not Authorized, Token failed");
    }
  }

  if (!token) {
    statusCode = 401; // Set statusCode value
    throw new Error("Not Authorized, no token");
  }

  res.status(statusCode); // Set status code using the initialized variable
});

module.exports = { protect };
