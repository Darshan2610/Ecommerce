const User = require("../models/UserModel")
const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  let statusCode; // Initialize statusCode variable

  const userExist = await User.findOne({ email });

  if (userExist) {
    statusCode = 400; // Set statusCode value
    throw new Error("User Already Exists!");
  }

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    statusCode = 404; // Set statusCode value
    throw new Error("User Not Found");
  }

  res.status(statusCode); // Set status code using the initialized variable
});




const authController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    let statusCode;
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token : generateToken(user._id),
            
        })
    } else {
        statusCode = 401
        throw new Error("Invalid Email or Password")

    }
    res.status(statusCode);
});


const getUserProfile = asyncHandler(async (req, res) => {
  let statusCode; // Initialize statusCode variable

  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    statusCode = 404; // Set statusCode value
    throw new Error("User Not Found");
  }

  res.status(statusCode); // Set status code using the initialized variable
});



const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  let statusCode = 200; // Initialize statusCode with a default value
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.status(statusCode).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    });
  } else {
    statusCode = 404; // Assign the desired value for statusCode
    res.status(statusCode);
    throw new Error("User not found!");
  }
});





module.exports = { authController, getUserProfile,registerUser,updateUserProfile };
