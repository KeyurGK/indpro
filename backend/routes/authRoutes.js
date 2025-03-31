const express = require("express");
const { accountSignup, accountLogin, refreshAccessToken } = require("../controllers/auth/authController");

const router = express.Router();

router.post("/signUp", accountSignup);
router.post("/login", accountLogin);
router.post("/refresh-token",refreshAccessToken);

module.exports = router; // ✅ Corrected export
