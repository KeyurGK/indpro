
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import MainPage from "./components/MainPage";
// import Tasks from "./pages/Tasks";
// import Category from "./pages/Category";

// const App = () => (
 
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />

//       {/* Main layout with sidebar */}
//       <Route path="/home" element={<MainPage />}>
//         <Route index element={<h2>Welcome to the Dashboard</h2>} />
//         <Route path="tasks" element={<Tasks />} />
//         <Route path="category" element={<Category />} />
//       </Route>
//     </Routes>
  
// );

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import Tasks from "./pages/Tasks";
import Category from "./pages/Category";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.Account.isAuthenticated) || 
                          sessionStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

const App = () => (
  
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<MainPage />}>
          <Route index element={<h2>Welcome to the Dashboard</h2>} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="category" element={<Category />} />
        </Route>
      </Route>
    </Routes>
  
);

export default App;
