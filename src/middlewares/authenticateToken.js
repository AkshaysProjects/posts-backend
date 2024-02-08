const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Initialize dotenv to load environment variables from.env file
dotenv.config();

const authenticateRefreshToken = (req, res, next) => {
  // Fetch the refresh token from the request body
  const refreshToken = req.body.refresh_token;

  if (refreshToken == null) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // 403 Forbidden
    }

    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { authenticateRefreshToken };
