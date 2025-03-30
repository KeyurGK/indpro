const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate Access Token (Short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.emailId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Short-lived token
  );
};

// Generate Refresh Token (Long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.emailId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Long-lived token
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
