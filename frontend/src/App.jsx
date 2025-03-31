// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import MainPage from "./components/Mainpage";
// import "./index.css";
// import Tasks from "./pages/Tasks";
// import Category from "./pages/Category";


// const App = () => (
  
   
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/home" element={<MainPage />} />
//         <Route path="/home/tasks" element={<Tasks />} />
//         <Route path="/home/category" element={<Category />} />
//       </Routes>
    
 
// );

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import Tasks from "./pages/Tasks";
import Category from "./pages/Category";

const App = () => (
 
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main layout with sidebar */}
      <Route path="/home" element={<MainPage />}>
        <Route index element={<h2>Welcome to the Dashboard</h2>} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="category" element={<Category />} />
      </Route>
    </Routes>
  
);

export default App;
