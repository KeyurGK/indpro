

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCategoryList } from "../../Redux/CategoryReducer/CategorySlice";
import { UpdateTask } from "../../Redux/TaskReducer/TaskSlice"; // Import the correct update action
import { toast } from "react-toastify";

const TaskModal = ({ isOpen, onClose, task,taskId }) => {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state) => state.Category);

  const [editedTask, setEditedTask] = useState({
    taskId: taskId || "",
    title: task?.title || "",
    description: task?.description || "",
    completed: task?.completed || false,
    categoryId: task?.categoryId || "",
  });

  useEffect(() => {
    dispatch(GetCategoryList());
  }, [dispatch]);

  if (!isOpen || !task) return null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    setEditedTask((prev) => ({ ...prev, categoryId: e.target.value }));
  };

  // Handle save (dispatch the updateTask action)
  const handleSave = async () => {
    if (!editedTask.title.trim() || !editedTask.description.trim() || !editedTask.categoryId) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await dispatch(UpdateTask(editedTask)).unwrap();
      if(response.success){
        toast.success("Task updated successfully!");
        onClose();
      }
     
    } catch (error) {
      toast.error(error.message || "Failed to update task.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-40 bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

        {/* Title Input */}
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Description Input */}
        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={editedTask.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-4"
        ></textarea>

        {/* Category Dropdown */}
        <label className="block mb-2">Category</label>
        <select
          onChange={handleCategorySelect}
          className="w-full p-2 border rounded-md mb-4"
          value={editedTask.categoryId}
        >
          <option value="">Select a Category</option>
          {categoryList.map((cat) => (
            <option key={cat.categoryid} value={cat.categoryid}>
              {cat.category}
            </option>
          ))}
        </select>

        {/* Completed Checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={editedTask.completed}
            onChange={(e) => setEditedTask((prev) => ({ ...prev, completed: e.target.checked }))}
            className="mr-2"
          />
          <label>Mark as Completed</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
            Close
          </button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
