import { useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", status: "Yes" },
    { id: 2, name: "Clothing", status: "No" },
    { id: 3, name: "Books", status: "Yes" },
  ]);
  const [editId, setEditId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleEditClick = (id, currentStatus) => {
    setEditId(id);
    setNewStatus(currentStatus);
  };

  const handleSave = (id) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleAddCategory = () => {
    if (/^[A-Za-z]+$/.test(newCategory)) {
      setCategories([...categories, { id: categories.length + 1, name: newCategory, status: "No" }]);
      setNewCategory("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Add Category
      </button>

      <table className="border border-black w-full text-left">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black p-2">SL No</th>
            <th className="border-r border-black p-2">Category</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id} className="border-b border-black">
              <td className="border-r border-black p-2">{index + 1}</td>
              <td className="border-r border-black p-2">{category.name}</td>
              <td className="p-2">
                {editId === category.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="border border-black p-1"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <button onClick={() => handleSave(category.id)}>✅</button>
                    <button onClick={handleCancel}>❌</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span>{category.status}</span>
                    <button
                      onClick={() => handleEditClick(category.id, category.status)}
                      className="border border-black px-2 py-1 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-black w-full p-2 mb-4"
              placeholder="Enter category name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleAddCategory}
                disabled={!/^[A-Za-z]+$/.test(newCategory)}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
              >
                Add
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;