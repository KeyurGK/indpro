const pool = require("../../config/db");

const addCategory = async (req, res) => {
    const { categoryName } = req.body;
    const isActive = "active";

    try {
        const createCategoryMasterQuery = `
        CREATE TABLE IF NOT EXISTS CATEGORIES (
            categoryId SERIAL PRIMARY KEY,
            category VARCHAR(20) UNIQUE NOT NULL,
            status VARCHAR(10) NOT NULL
        );`;
        await pool.query(createCategoryMasterQuery);

        const insertCategoryQuery = `
        INSERT INTO CATEGORIES (category, status)
        VALUES ($1, $2)
        RETURNING *;`;

        const values = [categoryName, isActive];
        const result = await pool.query(insertCategoryQuery, values);

        res.status(201).json({ success: true, message: "Category added successfully", category: result.rows[0] });
    } catch (error) {
        console.error("Add Category Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const loadCategories = async (req, res) => {
    try {
        const loadQuery = `SELECT * FROM CATEGORIES;`;
        const result = await pool.query(loadQuery);

        res.status(200).json({
            success: true,
            message: "All categories loaded successfully",
            data: result.rows, 
        });
    } catch (error) {
        console.error("Load Categories Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const updateCategory = async (req, res) => {
    const { categoryId, status } = req.body;

    try {
        const updateQuery = `
        UPDATE CATEGORIES
        SET status = $1
        WHERE categoryId = $2
        RETURNING *;`;  

        const values = [status, categoryId];
        const result = await pool.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category status updated successfully",
            category: result.rows[0]
        });

    } catch (error) {
        console.error("Update Category Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { addCategory, loadCategories, updateCategory };
