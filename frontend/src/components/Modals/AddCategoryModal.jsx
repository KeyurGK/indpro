import { useState } from "react";
import { IoClose } from "react-icons/io5";

const AddCategoryModal = ({ newCategory, setNewCategory, setIsModalOpen, handleAddCategory }) => {
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!newCategory.trim()) {
      setError("Category name is required.");
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(newCategory)) {
      setError("Only alphabets are allowed.");
      return;
    }

    setError(""); // Clear error if valid
    handleAddCategory();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-40 bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
        {/* Close Button at Top Right */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add New Category</h2>

        <input
          type="text"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            setError(""); // Clear error while typing
          }}
          className="border border-black w-full p-2 mb-2 rounded"
          placeholder="Enter category name"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
