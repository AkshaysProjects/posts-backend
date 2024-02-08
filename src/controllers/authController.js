const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/index");
const dotenv = require("dotenv");
const User = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Create a new user
const register = async (req, res) => {
  try {
    // Fetch the users collection from the database
    const Users = await db.collection("users");

    // Check if a user with the given username already exists
    const userExists = await Users.findOne({ email: req.body.username });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" }); // 409 Conflict
    }

    // Check if a user with the given email already exists
    const emailExists = await Users.findOne({ email: req.body.email });
    if (emailExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new Instance of the User model with the hashed password
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password_hashed: hashedPassword,
    });

    // Save the user to the database
    const userCreated = await Users.insertOne(user);

    // Create a Response object to send back to the client with sensitive data excluded
    const responseUser = {
      id: userCreated.insertedId,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
    };

    // Generate an access token for the newly created user
    const accessToken = jwt.sign(responseUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate a refresh token for the newly created user
    const refreshToken = jwt.sign(
      { id: responseUser.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Send the response back to the client
    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: responseUser,
      access_token: accessToken,
      token_type: "Bearer",
      expiresIn: "3600",
      refresh_token: refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    // Fetch the users collection from the database
    const Users = await db.collection("users");

    // Fetch the user with the given email or username
    const user = await Users.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    // If user does not exist return 404 Not Found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" }); // 404 Not Found
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password_hashed
    );

    // If the password is incorrect return 401 Unauthorized
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" }); // 401 Unauthorized
    }

    // Create a Response object to send back to the client with sensitive data excluded
    const responseUser = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
    };

    // Generate an access token for the user
    const accessToken = jwt.sign(
      responseUser,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate a refresh token for the user
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Send the response back to the client
    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: responseUser,
      access_token: accessToken,
      token_type: "Bearer",
      expiresIn: "3600",
      refresh_token: refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};

// Refresh an access token for a user
const refreshToken = async (req, res) => {
  try {
    // Fetch the users collection from the database
    const Users = await db.collection("users");

    // Fetch the user with the given refresh token
    const user = await Users.findOne({
      _id: new ObjectId(req.user.id),
    });

    const userData = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
    };

    // Generate a new access token for the user
    const accessToken = jwt.sign(
      userData,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate a new refresh token for the user
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Send the response back to the client
    res.status(200).json({
      access_token: accessToken,
      token_type: "Bearer",
      expiresIn: "3600",
      refresh_token: refreshToken,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error refreshing access token" });
  }
};

// Export the controllers
module.exports = { register, login, refreshToken };
