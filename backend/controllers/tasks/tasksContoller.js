const pool = require("../../config/db");

// Add Task
const addTask = async (req, res) => {
    const { title, description, categoryId } = req.body; 

    try {
        // Ensure the TASKS table exists
        const createTaskTableQuery = `
        CREATE TABLE IF NOT EXISTS TASKS (
            taskId SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            categoryId INTEGER NOT NULL,
            completed BOOLEAN DEFAULT false,
            createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            FOREIGN KEY (categoryId) REFERENCES CATEGORIES(categoryId) ON DELETE RESTRICT
        );`;
        await pool.query(createTaskTableQuery);

        // Check if category exists
        const categoryCheckQuery = `SELECT * FROM CATEGORIES WHERE categoryId = $1;`;
        const categoryResult = await pool.query(categoryCheckQuery, [categoryId]);

        if (categoryResult.rows.length === 0) {
            return res.status(400).json({ success: false, error: "Invalid categoryId. Category does not exist." });
        }

        // Insert Task
        const insertQuery = `
        INSERT INTO TASKS (title, description, categoryId)
        VALUES ($1, $2, $3)
        RETURNING *;`;

        const values = [title, description, categoryId];
        const result = await pool.query(insertQuery, values);

        res.status(201).json({ 
            success: true, 
            message: "Task added successfully", 
            task: result.rows[0] 
        });

    } catch (error) {
        console.error("Add Task Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Load All Tasks
const loadTasks = async (req, res) => {
    try {
        const { categoryId, completed, search } = req.query; // Extract query params
        let filters = [];
        let values = [];
        let query = `
            SELECT 
                t.taskId, 
                t.title, 
                t.description, 
                t.completed,
                t.createdAt,
                json_build_object(
                    'categoryId', c.categoryId,
                    'categoryName', c.category,
                    'status', c.status
                ) AS category
            FROM TASKS t
            JOIN CATEGORIES c ON t.categoryId = c.categoryId
        `;

        // Apply filters based on query parameters
        if (categoryId) {
            filters.push(`c.categoryId = $${values.length + 1}`);
            values.push(categoryId);
        }
        if (completed !== undefined) {
            filters.push(`t.completed = $${values.length + 1}`);
            values.push(completed === "true"); // Convert string to boolean
        }
        if (search) {
            filters.push(`LOWER(t.title) LIKE LOWER($${values.length + 1})`);
            values.push(`%${search}%`);
        }

        // Append WHERE clause if there are filters
        if (filters.length > 0) {
            query += ` WHERE ` + filters.join(" AND ");
        }

        query += `;`; // Finalize query

        const result = await pool.query(query, values);

        res.status(200).json({
            success: true,
            message: "Tasks loaded successfully",
            tasks: result.rows
        });
    } catch (error) {
        console.error("Load Tasks Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


// Update Task (Title, Description, Completed Status)
const updateTask = async (req, res) => {
    const { taskId, title, description, completed } = req.body;

    try {
        const updateQuery = `
        UPDATE TASKS 
        SET title = $1, description = $2, completed = $3
        WHERE taskId = $4
        RETURNING *;`;

        const values = [title, description, completed, taskId];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Task updated successfully", 
            task: result.rows[0] 
        });

    } catch (error) {
        console.error("Update Task Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const deleteQuery = `DELETE FROM TASKS WHERE taskId = $1 RETURNING *;`;
        const result = await pool.query(deleteQuery, [taskId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });

    } catch (error) {
        console.error("Delete Task Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { addTask, loadTasks, updateTask, deleteTask };
