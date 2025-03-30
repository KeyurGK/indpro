const express = require("express");
const { addTask, loadTasks, updateTask, deleteTask } = require("../controllers/tasks/tasksContoller");

const router = express.Router();

// Add a new task
router.post("/add", addTask);

// Load all tasks
router.get("/all", loadTasks);

// Update a task (title, description, completed status)
router.put("/update", updateTask);

// Delete a task by ID
router.delete("/delete/:taskId", deleteTask);

module.exports = router;
