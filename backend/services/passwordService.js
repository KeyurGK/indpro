const bcrypt = require("bcrypt");

// Hash password before saving
const hashPassword = async (password) => {
  const saltRounds = 10; // Recommended value for security
  return await bcrypt.hash(password, saltRounds);
};

// Verify password during login
const comparePassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};

module.exports = { hashPassword, comparePassword };
