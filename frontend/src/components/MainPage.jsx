// import { Link, Routes, Route, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Tasks from "../pages/Tasks";
// import Category from "../pages/Category";

// const MainPage = () => {
//   const navigate = useNavigate();
//   const [firstName, setFirstName] = useState("");

//   useEffect(() => {
//     // Fetch user info (Replace with actual API call)
//     const user = { firstName: "John" }; // Replace with actual data
//     setFirstName(user.firstName);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/"); // Redirect to login page
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-white text-black p-6 flex flex-col border-r shadow-md">
//         <nav className="space-y-4">
//           <Link to="/home" className="block py-2 px-4 rounded-md hover:bg-gray-200">
//             Dashboard
//           </Link>
//           <Link to="/home/tasks" className="block py-2 px-4 rounded-md hover:bg-gray-200">
//             Tasks
//           </Link>
//           <Link to="/home/category" className="block py-2 px-4 rounded-md hover:bg-gray-200">
//             Category
//           </Link>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar (Top Bar) */}
//         <div className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md">
//           <h1 className="text-2xl font-bold">FlowTask</h1>
//           <div className="flex items-center">
//             <span className="text-lg font-semibold mr-4">{firstName}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

        
//       </div>
//     </div>
//   );
// };

// export default MainPage;
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MainPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Fetch user info (Replace with actual API call)
    const user = { firstName: "John" }; // Replace with actual data
    setFirstName(user.firstName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white text-black p-6 flex flex-col border-r shadow-md">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (Top Bar) */}
        <div className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold">FlowTask</h1>
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-4">{firstName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-auto flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
