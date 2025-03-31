import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddCategory, GetCategoryList } from "../Redux/CategoryReducer/CategorySlice";
import AddCategoryModal from "../components/Modals/AddCategoryModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCookie from "../hooks/useCookie";
import Cookies from "js-cookie";

const Category = () => {
  const token = useCookie("access");
  const dispatch = useDispatch();
  const { categoryList, loading, error } = useSelector((state) => state.Category);

  useEffect(() => {
    const fetchCategories = async () => {
      const storedToken = Cookies.get("access"); // Ensure fresh token from cookies
      if (storedToken) {
        await dispatch(GetCategoryList(storedToken)); // Pass fresh token
      }
    };

    fetchCategories();
  }, [token, dispatch]); // Ensure it triggers when token updates

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

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
      // console.log(response, "response add");

      if (response.success) {
        toast.success(response?.message || "Category added successfully!", { position: "top-right", autoClose: 3000 });
        setIsModalOpen(false);
        setNewCategory(""); // Reset field
        dispatch(GetCategoryList()); // Refresh list
      } else {
        toast.error(response?.error || "Error adding category", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error?.message || "Error adding category", { position: "top-right", autoClose: 3000 });
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
            <tr className="border-b border-black text-center">
              <th className="border-r border-black p-2">SL No</th>
              <th className="border-r border-black p-2">Category</th>
              {/* <th className="border-r border-black p-2">Action</th> */}
              <th className="p-2">Status</th>
            </tr>
          </thead>
          
          <tbody>
            {categoryList.map((category, index) => (
              <tr key={category?.categoryid} className="border-b border-black text-center">
                <td className="border-r border-black p-2">{index + 1}</td>
                <td className="border-r border-black p-2">
                  {typeof category?.category === "string" ? category?.category : JSON.stringify(category?.category)}
                </td>
                {/* <td className="border-r border-black p-2">
                  <button
                    onClick={() => toast.info(`Editing ${category?.category}`, { position: "top-right", autoClose: 3000 })}
                    className="border border-black px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Edit
                  </button>
                </td> */}
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      category?.status?.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {category?.status}
                  </span>
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Category;
