const express = require("express");
const { login, register } = require("../controllers/authController");

// Initialize express router
const authRoutes = express.Router();

// Define routes
authRoutes.post("/login", login);
authRoutes.post("/register", register);

// Export the router
module.exports = authRoutes;
