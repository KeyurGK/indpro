const express = require("express");
const verifyAccessToken = require("../middlewares/authMiddleware");
const { loadCategories, addCategory, updateCategory } = require("../controllers/masterScreen/categoryController");
const router = express.Router();


router.get("/all",verifyAccessToken,loadCategories);
router.post("/add",verifyAccessToken,addCategory);
router.put("/update",verifyAccessToken,updateCategory);


module.exports = router;