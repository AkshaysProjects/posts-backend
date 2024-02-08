const express = require("express");
const {
  login,
  register,
  refreshToken,
} = require("../controllers/authController");
const {
  authenticateRefreshToken,
} = require("../middlewares/authenticateToken");

// Initialize express router
const authRoutes = express.Router();

// Define middleware for refresh token authentication
authRoutes.use("/refresh", authenticateRefreshToken);

// Define routes
authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/refresh", refreshToken);

// Export the router
module.exports = authRoutes;
