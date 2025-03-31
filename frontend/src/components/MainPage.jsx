
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu
import Cookies from "js-cookie";
const MainPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const { loggedInfo, isAuthenticated } = useSelector(state => state.Account);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

  sessionStorage.setItem("profile", loggedInfo?.user?.firstname);

  useEffect(() => {
    setFirstName(loggedInfo?.user?.firstname);
  }, []);

  const profile = sessionStorage.getItem("profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("access");
    Cookies.remove("refreshToken");
    sessionStorage.removeItem("profile");
    sessionStorage.removeItem("isAuthenticated")
   
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar (Full Width) */}
      <div className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md w-full">
        <h1 className="text-2xl font-bold">FlowTask</h1>
        
        <div className="flex items-center">
          {/* <span className="text-lg font-semibold mr-4 hidden sm:block">{profile || ""}</span> */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hidden sm:block"
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            className="ml-4 sm:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-grow">
        {/* Sidebar for larger screens */}
        <div className={`w-1/4 bg-white text-black p-6 flex-col shadow-md hidden md:flex`}>
          <nav className="space-y-4">
            <Link to="/home" className="block py-2 px-4 rounded-md hover:bg-gray-200">
              Dashboard
            </Link>
            <Link to="/home/tasks" className="block py-2 px-4 rounded-md hover:bg-gray-200">
              Tasks
            </Link>
            <Link to="/home/category" className="block py-2 px-4 rounded-md hover:bg-gray-200">
              Category
            </Link>
          </nav>
        </div>

        {/* Sidebar for mobile (Slide-in Menu) */}
        {sidebarOpen && (
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white p-6 shadow-lg z-50 md:hidden">
            <nav className="space-y-4">
              <button className="absolute top-4 right-4" onClick={() => setSidebarOpen(false)}>
                <X size={28} />
              </button>
              <Link to="/home" className="block py-2 px-4 rounded-md hover:bg-gray-200" onClick={() => setSidebarOpen(false)}>
                Dashboard
              </Link>
              <Link to="/home/tasks" className="block py-2 px-4 rounded-md hover:bg-gray-200" onClick={() => setSidebarOpen(false)}>
                Tasks
              </Link>
              <Link to="/home/category" className="block py-2 px-4 rounded-md hover:bg-gray-200" onClick={() => setSidebarOpen(false)}>
                Category
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white w-full px-4 py-2 rounded-md hover:bg-red-700 mt-4"
              >
                Logout
              </button>
            </nav>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-auto flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
