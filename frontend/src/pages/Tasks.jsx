import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import AddTaskModal from "../components/Modals/AddTaskModal";
import SearchModal from "../components/Modals/SearchModal";

const Tasks = () => {
  console.log("hiiiiii")
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", category: "" });
  const [firstName, setFirstName] = useState("John"); // Default user name
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setTasks([
      { id: 1, title: "Task 1", completed: false, category: "Work" },
      { id: 2, title: "Task 2", completed: true, category: "Personal" },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const categories = ["Work", "Personal", "Health", "Finance"];
  const statuses = ["Incomplete", "Complete"];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTask({ title: "", description: "", category: "" });
  };

  const handleOpenSearchModal = () => setIsSearchModalOpen(true);
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.category) {
      setTasks([...tasks, { id: tasks.length + 1, ...newTask, completed: false }]);
      handleCloseModal();
    } else {
      alert("Title and category are required.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedCategory === "" || task.category === selectedCategory) &&
      (selectedStatus === "" || (selectedStatus === "Complete" ? task.completed : !task.completed)) &&
      (searchQuery === "" || task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md w-full">
        <h1 className="text-2xl font-bold">FlowTask</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold hidden sm:block">{firstName}</span>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Logout
          </button>
          <button className="sm:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className={`fixed inset-y-0 left-0 bg-white shadow-md p-6 w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
          <nav className="space-y-4">
            <Link to="/home" className="block py-2 px-4 rounded-md hover:bg-gray-200">Dashboard</Link>
            <Link to="/home/tasks" className="block py-2 px-4 rounded-md hover:bg-gray-200">Tasks</Link>
            <Link to="/home/category" className="block py-2 px-4 rounded-md hover:bg-gray-200">Category</Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded-md w-full md:w-auto">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="p-2 border rounded-md w-full md:w-auto">
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button onClick={handleOpenSearchModal} className="p-2 border rounded-md w-full md:w-auto">
                <FaSearch size={20} />
              </button>
            </div>
            <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto mt-2 md:mt-0">
              + Add Task
            </button>
          </div>

          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li key={task.id} className="p-4 border rounded-md shadow-sm">
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.title} ({task.category})
                </span>
              </li>
            ))}
          </ul>
        </main>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={handleCloseModal} onAdd={handleAddTask} newTask={newTask} handleChange={handleChange} categories={categories} />
      <SearchModal isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};

export default Tasks;
