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
        return res.status(401).json({success:false, error: "Invalid credentials" });
      }
  
      const user = loginResponse.rows[0];
  
      // Verify hashed password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({success:false, error: "Incorrect password" });
      }
  
      // Generate JWT tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Send refresh token in HTTP-only, Secure cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,  // Set to false in development if using Postman
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      // Send access token in response
      res.status(200).json({success:true, message: "Login successful", accessToken });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = { accountSignup, accountLogin };
