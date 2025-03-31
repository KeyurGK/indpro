const pool = require("../../config/db");
const { generateAccessToken, generateRefreshToken } = require("../../services/jwtService");
const { hashPassword, comparePassword } = require("../../services/passwordService");

// User Signup Controller
const accountSignup = async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    // Ensure USERS table exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS USERS (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(20) NOT NULL,
        lastName VARCHAR(20) NOT NULL,
        emailId VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Insert user data into USERS table
    const insertQuery = `
      INSERT INTO USERS (firstName, lastName, emailId, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [firstName, lastName, emailId, hashedPassword];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({success:true, message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success:false,error: "Internal Server Error" });
  }
};

// User Login Controller
const accountLogin = async (req, res) => {
  const { emailId, password } = req.body;

  try {
      const loginQuery = `SELECT * FROM USERS WHERE emailId = $1`;
      const values = [emailId];

      const loginResponse = await pool.query(loginQuery, values);

      if (loginResponse.rows.length === 0) {
          return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      const user = loginResponse.rows[0];

      // Verify hashed password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ success: false, error: "Incorrect password" });
      }

      // Generate JWT tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token in the database
      const updateTokenQuery = `UPDATE USERS SET refreshToken = $1 WHERE id = $2`;
      await pool.query(updateTokenQuery, [refreshToken, user.id]);

      // Send refresh token in HTTP-only, Secure cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", // ✅ Secure only in production
        sameSite: "Strict",
        // path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

      // Send access token in response
      res.status(200).json({ success: true, message: "Login successful", accessToken });
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


//Generate a new access token 
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken,'refresh')
    
    if (!refreshToken) {
      return res.status(403).json({ success: false, error: "Refresh token missing" });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log(decoded,'decoded')
    } catch (err) {
      return res.status(403).json({ success: false, error: "Invalid refresh token" });
    }

    // Check if refresh token exists in the database
    const tokenQuery = `SELECT * FROM USERS WHERE id = $1 AND refreshToken = $2`;
    const result = await pool.query(tokenQuery, [decoded.id, refreshToken]);

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, error: "Refresh token not valid" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(result.rows[0]);

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


module.exports = { accountSignup, accountLogin,refreshAccessToken };
