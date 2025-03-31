import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddCategory, GetCategoryList } from "../Redux/CategoryReducer/CategorySlice";
import AddCategoryModal from "../components/Modals/AddCategoryModal";
import { toast } from "react-toastify";
import useCookie from "../hooks/useCookie";

const Category = () => {
  const token = useCookie("access")
  console.log(token)
  const dispatch = useDispatch();
  const { categoryList, loading, error } = useSelector((state) => state.Category);

  useEffect(() => {
    if (token) {
      dispatch(GetCategoryList(token)); // Pass token to the action
    }
  }, [token, dispatch]);

  // Local state
  const [editId, setEditId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleEditClick = (id, currentStatus) => {
    setEditId(id);
    setNewStatus(currentStatus);
  };

  const handleSave = (id) => {
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name is required.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!/^[A-Za-z]+$/.test(newCategory)) {
      toast.error("Only alphabets are allowed.", { position: "top-right", autoClose: 3000 });
      return;
    }

    const payload = { categoryName: newCategory };

    try {
      const response = await dispatch(AddCategory(payload)).unwrap();
      toast.success(response?.message || "Category added successfully!", { position: "top-right", autoClose: 3000 });
      setIsModalOpen(false);
      setNewCategory(""); // Reset field
      dispatch(GetCategoryList()); // Refresh list
    } catch (error) {
      toast.error(error || "Error adding category", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Category
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="border border-black w-full text-left">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black p-2">SL No</th>
              <th className="border-r border-black p-2">Category</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map((category, index) => (
              <tr key={category?.categoryid} className="border-b border-black">
                <td className="border-r border-black p-2">{index + 1}</td>
                <td className="border-r border-black p-2">{category?.category}</td>
                <td className="p-2">
                  {editId === category?.categoryid ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border border-black p-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button onClick={() => handleSave(category?.categoryid)}>✅</button>
                      <button onClick={handleCancel}>❌</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span>{category?.status}</span>
                      <button
                        onClick={() => handleEditClick(category?.categoryid, category?.status)}
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
      )}

      {isModalOpen && (
        <AddCategoryModal
          setNewCategory={setNewCategory}
          setIsModalOpen={setIsModalOpen}
          newCategory={newCategory}
          handleAddCategory={handleAddCategory}
        />
      )}
    </div>
  );
};

export default Category;
