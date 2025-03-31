const express = require("express");
const verifyAccessToken = require("../middlewares/authMiddleware");
const { loadCategories, addCategory, updateCategory } = require("../controllers/masterScreen/categoryController");
const router = express.Router();


router.get("/all",loadCategories);
router.post("/add",addCategory);
router.put("/update",updateCategory);


module.exports = router;