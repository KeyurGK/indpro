import React, { useEffect, useState } from "react";
import useCookie from "../../hooks/useCookie";
import { useDispatch, useSelector } from "react-redux";
import { GetCategoryList } from "../../Redux/CategoryReducer/CategorySlice";
import { AddTask } from "../../Redux/TaskReducer/TaskSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const token = useCookie("access");
  const dispatch = useDispatch();
  const { categoryList, loading, error } = useSelector((state) => state.Category);

  const [newTask, setNewTask] = useState({ title: "", description: "", categoryId: null });
  const [errors, setErrors] = useState({ title: "", description: "", category: "" });

  useEffect(() => {
    if (token) {
      dispatch(GetCategoryList(token));
    }
  }, [token, dispatch]);

  if (!isOpen) return null;

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔹 Handle category selection (Only one category allowed)
  const handleCategorySelect = (e) => {
    const selectedCategoryId = parseInt(e.target.value);
    if (!selectedCategoryId) return;

    setNewTask((prev) => ({
      ...prev,
      categoryId: selectedCategoryId, // Replaces the previous category
    }));

    setErrors((prev) => ({ ...prev, category: "" }));
  };

  // 🔹 Submit form
  const handleSubmit = () => {
    let validationErrors = {};
  
    if (!newTask.title.trim()) validationErrors.title = "Title is required.";
    if (!newTask.description.trim()) validationErrors.description = "Description is required.";
    if (!newTask.categoryId) validationErrors.category = "A category is required.";
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const payload = {
      title: newTask.title,
      description: newTask.description,
      categoryId: newTask.categoryId, // Stores as a single integer
    };
  
    dispatch(AddTask(payload))
      .then((response) => {
        console.log(response)
        if (response.error) {
          console.error("Task addition failed:", response.error.message);
        } else {
          toast.success(response?.message, { position: "top-right", autoClose: 3000 });
          onClose();
          console.log("Task added successfully:", response.payload);
         
        }
      })
      .catch((error) => console.error("Unexpected error:", error));
  };

  // 🔹 Filter active categories
  const activeCategories = categoryList.filter((cat) => cat.status === "active");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-40 bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-96 overflow-hidden flex flex-col z-20">
        <h3 className="text-2xl font-semibold mb-4">Add New Task</h3>

        {/* Task Title */}
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleChange}
          placeholder="Task Title"
          className={`w-full p-2 border rounded-md mb-1 ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title}</p>}

        {/* Task Description */}
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          placeholder="Task Description"
          className={`w-full p-2 border rounded-md mb-1 h-20 resize-none overflow-y-auto ${
            errors.description ? "border-red-500" : ""
          }`}
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mb-2">{errors.description}</p>}

        {/* Category Dropdown */}
        <select
          onChange={handleCategorySelect}
          className={`w-full p-2 border rounded-md mb-1 ${errors.category ? "border-red-500" : ""}`}
          value={newTask.categoryId || ""}
        >
          <option value="">Select a Category</option>
          {activeCategories.map((cat) => (
            <option key={cat.categoryid} value={cat.categoryid}>
              {cat.category}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mb-2">{errors.category}</p>}

        {/* Selected Category */}
        {newTask.categoryId && (
          <div className="flex items-center gap-2 bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-sm mb-3">
            {activeCategories.find((cat) => cat.categoryid === newTask.categoryId)?.category}
            <button
              onClick={() => setNewTask((prev) => ({ ...prev, categoryId: null }))}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-auto">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Add Task
          </button>
        </div>
      </div>
  
    </div>
  );
};

export default AddTaskModal;
