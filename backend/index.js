require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Enable cookie parsing
app.use(cors({ origin: "*", credentials: true })); // Adjust origin as needed

// Routes
app.use("/api/auth", authRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Authentication API");
});

// Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
