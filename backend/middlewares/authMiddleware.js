const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Access token missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Access token expired. Please refresh your token.",
        });
      }
      return res.status(403).json({ success: false, error: "Invalid access token" });
    }

    // Attach decoded user info to request object
    req.user = decoded;
    next(); // Proceed to the next middleware/controller
  });
};

module.exports = verifyAccessToken;
