import React from "react";

const AddTaskModal = ({ isOpen, onClose, onAdd, newTask, handleChange, categories }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-40 bg-opacity-30 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-2xl font-semibold mb-4">Add New Task</h3>
      <input
        type="text"
        name="title"
        value={newTask.title}
        onChange={handleChange}
        placeholder="Task Title"
        className="w-full p-2 border rounded-md mb-3"
      />
      <textarea
        name="description"
        value={newTask.description}
        onChange={handleChange}
        placeholder="Task Description (Optional)"
        className="w-full p-2 border rounded-md mb-3"
      ></textarea>
      <select
        name="category"
        value={newTask.category}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-3"
      >
        <option value="">Select a Category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={onAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Task
        </button>
      </div>
    </div>
  </div>
    )


};


export default AddTaskModal;