const express = require("express");
const { accountSignup, accountLogin } = require("../controllers/auth/authController");

const router = express.Router();

router.post("/signUp", accountSignup);
router.post("/login", accountLogin);

module.exports = router; // ✅ Corrected export
